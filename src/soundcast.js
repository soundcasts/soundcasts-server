const js2xmlparser = require('js2xmlparser');
const moment = require('moment');

const config = require('./config.js');
const SoundCloud = require('./soundcloud.js');
const { formatDuration, makeUrl } = require('./util.js');

function getSoundcast({userId, title, regexString='.*', minDuration=0}) {
  if (!userId || !title || !regexString) {
    return Promise.reject('userId, title, regexString are required');
  }

  const soundcast = {
    'username': userId,
    title,
    regexString,
    minDuration: minDuration * 60000,
  };

  const clientId = config.soundcloud.clientId;
  const userPromise = getUserData(userId, clientId);
  const tracksPromise = userPromise
    .then(user => getTracksData(user.id, regexString, minDuration, clientId));

  return Promise
    .all([userPromise, tracksPromise])
    .then(([user, tracks]) => Object.assign({}, soundcast, user, {tracks}));
}

function getUserData(username, clientId) {
  const userMap = user => ({
    author: user.username,
    id: user.id,
    link: user.permalink_url,
    description: user.description,
    image: user.avatar_url.replace(/large/, 't200x200'),
  });

  const soundcloud = new SoundCloud(clientId);
  return soundcloud
    .getUser(username)
    .then(userMap);
}

function getTracksData(userId, regexString, minDuration, clientId) {
  const soundcloud = new SoundCloud(clientId);

  const trackRegex = new RegExp(regexString, 'i');
  const trackFilter = track => (
    trackRegex.test(track.title)
    && track.streamable
    && track.state === 'finished'
    && track.duration >= minDuration
  );

  const trackMap = track => ({
    title: track.title,
    description: track.description,
    duration: formatDuration(track.duration),
    url: `${track.stream_url}?client_id=${config.soundcloud.clientId}`,
    size: 1,
    fileFormat: 'mp3',
    httpFormat: 'audio/mpeg',
    published: moment(track.created_at, 'YYYY/MM/DD HH:mm:ss ZZ').utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
  });

  return soundcloud
    .getTracks(userId)
    .then(tracks => tracks.filter(trackFilter))
    .then(tracks => tracks.map(trackMap));
}

function soundcastToXml(soundcast, request) {
  const dataObject = {
    '@': {
      'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
      version: '2.0'
    },
    channel: {
      title: soundcast.title,
      'itunes:author': soundcast.author,
      link: soundcast.link,
      description: `This is a custom podcast featuring the music of ${soundcast.author} created using Soundcasts: https://www.soundcasts.net`,
      'itunes:image': {
        '@': {
          href: soundcast.image
        }
      },
      item: soundcast.tracks
        .map(track => ({
          title: track.title,
          'itunes:duration': track.duration,
          pubDate: track.published,
          'itunes:summary': track.description,
          description: track.description,
          guid: track.url,
          enclosure: {
            '@': {
              url: makeUrl(request, { path: `/track.${track.fileFormat}`, query: {url: encodeURIComponent(track.url)} }),
              length: track.size,
              type: track.httpFormat
            }
          }
        })
      )
    }
  };
  const dataString = js2xmlparser('rss', dataObject);
  const safeDataString = dataString.replace(/[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm, ''); // remove illegal xml characters
  return safeDataString;
}

module.exports = {
  getSoundcast,
  getUserData,
  getTracksData,
  soundcastToXml
};
