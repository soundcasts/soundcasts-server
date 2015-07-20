import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import moment from 'moment';
import js2xmlparser from 'js2xmlparser';
import shortid from 'shortid';

import SoundCloud from './SoundCloud.js';
import CONSTANTS from '../lib/constants.js';


var schema = new mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    'default': shortid.generate
  },

  // supplied by user
  title: String,
  userId: Number,
  regexString: String,

  // retrieved from soundcloud api
  author: String,
  link: String,
  description: String,
  image: String,

  tracks: [{
    _id: { type: Number, unique: true },
    title: String,
    description: String,
    duration: String,
    url: String,
    size: Number,
    fileFormat: String,
    httpFormat: String,
    published: String
  }]
});
schema.plugin(timestamps);


schema.methods.regex = function() {
  return new RegExp(this.regexString, 'i');
};

schema.methods.needsUpdate = function() {
  if (this.tracks.length === 0) return true;
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
        .filter(track => {
          return !!track.title.match(this.regex())
            && track.downloadable
            && track.state === 'finished';
        })
        .map((trackData) => {
          var track = {};
          if (this.tracks.id(track.id)) track = this.tracks.id(track.id);
          return {
            track: track,
            trackData: trackData
          };
        })
        .map(({track, trackData}) => {
          track._id = trackData.id;
          track.title = trackData.title;
          track.description = trackData.description;
          track.duration = formatDuration(trackData.duration);
          track.url = `${trackData.download_url}?client_id=${CONSTANTS.CLIENT_ID}`;
          track.size = trackData.original_content_size;
          track.fileFormat = trackData.original_format;
          track.httpFormat = httpFormat(track.fileFormat);
          track.published = moment(trackData.created_at, 'YYYY/MM/DD HH:mm:ss ZZ').utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ');
          return track;
        });
      this.updatedAt = new Date;
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
      title: this.title,
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
          pubDate: track.published,
          'itunes:summary': track.description,
          description: track.description,
          guid: track.id,
          enclosure: {
            '@': {
              url: `https://soundcasts.net/${this.id}/tracks/${track.id}.${track.fileFormat}`,
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
