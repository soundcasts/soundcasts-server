import js2xmlparser from 'js2xmlparser';
import moment from 'moment';

import CONSTANTS from './constants';
import SoundCloud from './SoundCloud';
import {formatDuration, httpFormat, makeUrl} from './util';


export default class Soundcast {

  constructor(req) {
    this.req = req;
    var {title, userId, regexString} = req.query;

    this.title = title;
    this.userId = userId;
    this.regexString = regexString || '.*';
    this.regex = new RegExp(this.regexString, 'i');

    if (!title || !userId || !this.regexString) throw new Error('title, userId, regexString are required');

    this.channel = {
      title: title
    };
  }


  async getChannelData() {
    var sc = new SoundCloud(CONSTANTS.CLIENT_ID);

    var user = await sc.getUser(this.userId);
    this.channel.author = user.username;
    this.channel.link = user.permalink_url;
    this.channel.description = user.description;
    this.channel.image = user.avatar_url.replace(/large/, 't200x200').replace(/^https/, 'http');

    var tracks = await sc.getTracks(this.userId);
    this.channel.tracks = tracks
      .filter(track => {
        return (
          this.regex.test(track.title)
          && track.streamable
          && track.state === 'finished'
        );
      })
      .map(trackData => {
        var track = {};
        track.title = trackData.title;
        track.description = trackData.description;
        track.duration = formatDuration(trackData.duration);
        track.url = `${trackData.stream_url}?client_id=${CONSTANTS.CLIENT_ID}`;
        track.size = 1;
        track.fileFormat = 'mp3';
        track.httpFormat = 'audio/mpeg';
        track.published = moment(trackData.created_at, 'YYYY/MM/DD HH:mm:ss ZZ').utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ');
        return track;
      });

    return this.channel;
  }


  toXml() {
    var data = {
      '@': {
        'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
        version: '2.0'
      },
      channel: {
        title: this.channel.title,
        'itunes:author': this.channel.author,
        link: this.channel.link,
        description: `This is a custom podcast featuring the music of ${this.channel.author} created using Soundcasts: http://soundcasts.net.`,
        'itunes:image': {
          '@': {
            href: this.channel.image
          }
        },
        item: this.channel.tracks.map(track => {
          return {
            title: track.title,
            'itunes:duration': track.duration,
            pubDate: track.published,
            'itunes:summary': track.description,
            description: track.description,
            guid: track.url,
            enclosure: {
              '@': {
                url: makeUrl(this.req, { path: `/track/${encodeURIComponent(track.url)}/track.${track.fileFormat}`, query: {} }),
                length: track.size,
                type: track.httpFormat
              }
            }
          };
        })
      }
    };
    data = js2xmlparser('rss', data);
    data = data.replace(/[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm, ''); // remove illegal xml characters
    return data;
  }

}
