import {format} from 'url';

import moment from 'moment';


export function formatDuration(duration) {
  var m = moment.duration(duration);
  return ['hours', 'minutes', 'seconds']
    .map(t => String(m[t]()))
    .map(t => (t.length === 1) ? '0'+t : t)
    .join(':');
}


export function httpFormat(format) {
  var formats = {
    mp3: 'audio/mpeg',
    wav: 'audio/x-wav'
  };
  if (!formats[format]) {
    console.log('WARNING: no format found for', format);
    return 'audio/unknown';
  }
  return formats[format];
}


export function makeUrl(req, extra={}) {
  req = {
    protocol: req.protocol,
    host: req.get('host'),
    path: req.path,
    query: req.query
  };
  Object.assign(req, extra);

  return `${req.protocol}://${req.host}${req.path}${queryString(req.query)}`;
}


export function queryString(params) {
  var qs = [];
  Object.getOwnPropertyNames(params).forEach(key => {
    qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  });
  if (qs.length) return `?${qs.join('&')}`;
  else return '';
}
