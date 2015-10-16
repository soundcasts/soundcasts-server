import {format} from 'url';

import moment from 'moment';


export function formatDuration(duration) {
  var m = moment.duration(duration);
  return ['hours', 'minutes', 'seconds']
    .map(t => String(m[t]()))
    .map(t => (t.length === 1) ? '0'+t : t)
    .join(':');
}


export function makeUrl(origReq, extra={}) {
  var req = {
    protocol: origReq.protocol,
    get: origReq.get,
    path: origReq.path,
    query: origReq.query
  };
  Object.assign(req, extra);

  return `${req.protocol}://${req.get('host')}${req.path}${queryString(req.query)}`;
}


export function queryString(params) {
  var qs = [];
  Object.getOwnPropertyNames(params).forEach(key => {
    qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  });
  if (qs.length) return `?${qs.join('&')}`;
  else return '';
}
