const moment = require('moment');

function formatDuration(duration) {
  var m = moment.duration(duration);
  return ['hours', 'minutes', 'seconds']
    .map(t => String(m[t]()))
    .map(t => (t.length === 1) ? '0'+t : t)
    .join(':');
}

function makeUrl(origReq, extra={}) {
  var req = {
    protocol: origReq.protocol,
    get: origReq.get.bind(origReq),
    path: origReq.path,
    query: origReq.query
  };
  Object.assign(req, extra);

  return `${req.protocol}://${req.get('host')}${req.path}${queryString(req.query)}`;
}

function queryString(params) {
  var qs = [];
  Object.getOwnPropertyNames(params).forEach(key => {
    qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  });
  if (qs.length) return `?${qs.join('&')}`;
  else return '';
}

module.exports = {
  formatDuration,
  makeUrl,
  queryString
};
