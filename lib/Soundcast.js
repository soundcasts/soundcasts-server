import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import moment from 'moment';
import js2xmlparser from 'js2xmlparser';

import SoundCloud from './SoundCloud.js';
import CONSTANTS from '../lib/constants.js';


var schema = new mongoose.Schema({
  name: String,
  userId: Number,
  regexString: String,

  author: String,
  link: String,
  description: String,
  image: String,

  tracks: [{
    title: String,
    description: String,
    duration: String,
    url: String,
    size: Number,
    fileFormat: String,
    httpFormat: String,
    created: String
  }]
});
schema.plugin(timestamps);


schema.methods.regex = function() {
  return new RegExp(this.regexString, 'i');
};

schema.methods.needsUpdate = function() {
  var now = Date.now();
  var lastUpdated = new Date(this.updatedAt);
  return now - lastUpdated > CONSTANTS.CACHE_EXPIRATION;
};

schema.methods.update = function() {
  var sc = new SoundCloud(CONSTANTS.CLIENT_ID);
  return sc.getUser(this.userId)
    .then((user) => {
      this.author = user.username;
      this.link = user.permalink_url;
      this.description = user.description;
      this.image = user.avatar_url;
    })
    .then(() => sc.getTracks(this.userId))
    .then((tracks) => {
      this.tracks = tracks
        .filter(t => {
          return !!t.title.match(this.regex())
            && t.streamable
            && t.state === 'finished';
        })
        .map((t) => {
          t.duration = formatDuration(t.duration);
          t.url = `${t.stream_url}?client_id=${CONSTANTS.CLIENT_ID}`;
          t.size = t.original_content_size;
          t.fileFormat = t.original_format;
          t.httpFormat = httpFormat(t.fileFormat);
          t.created = moment(t.created_at, 'YYYY/MM/DD HH:mm:ss ZZ').utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ');
          return t;
        });
      return this.save();
    });

  function formatDuration(duration) {
    var m = moment.duration(duration);
    return ['hours', 'minutes', 'seconds']
      .map(t => String(m[t]()))
      .map(t => (t.length === 1) ? '0'+t : t)
      .join(':');
  }

  function httpFormat(format) {
    var formats = {
      mp3: 'audio/mpeg'
    };
    if (!formats[format]) console.log('WARNING: no format found for', format);
    return formats[format];
  }
};

schema.methods.toXml = function() {
  var data = {
    '@': {
      'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
      version: '2.0'
    },
    channel: {
      title: this.name,
      'itunes:author': this.author,
      link: this.link,
      description: `This is a custom podcast featuring ${this.author} created using Soundcasts: https://soundcasts.net`,
      'itunes:image': {
        '@': {
          href: this.image
        }
      },

      item: this.tracks.map((track) => {
        return {
          title: track.title,
          'itunes:duration': track.duration,
          pubDate: track.created,
          //description: 'track.description',
          //'itunes:summary': 'track.description',
          //description: track.description,
          //description: track.description,
          enclosure: {
            '@': {
              url: `https://soundcasts.net/soundcasts/${this.id}/tracks/${track.id}.${track.fileFormat}`,
              length: track.size,
              type: track.httpFormat
            }
          }
        };
      })
    }
  };
  return js2xmlparser('rss', data);
};


export default mongoose.model('Soundcast', schema);
