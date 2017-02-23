import request from 'request';

import config from './config.js';

const { soundcloud } = config;


const SOUNDCLOUD_URL = soundcloud.port ? `${soundcloud.host}:${soundcloud.port}` : soundcloud.host;


export default class SoundCloud {

  constructor(clientId) {
    if (!clientId) throw new Error('clientId is required');
    this.clientId = clientId;
  }

  getUser(username) {
    const url = `${SOUNDCLOUD_URL}/users/${username}`;
    return this._get(url);
  }

  getTracks(userId) {
    const tracks = [];
    const self = this;
    return new Promise(resolve => {
      const url = `${SOUNDCLOUD_URL}/users/${userId}/tracks`;
      self._getAll(url, tracks, resolve);
    });
  }

  _get(url, {client_id = this.clientId, format = 'json', ...other} = {}) {
    const options = {
      url: url,
      qs: {client_id, format, ...other},
      json: true
    };
    return new Promise((resolve, reject) => {
      request.get(options, (err, res, body) => {
        if (err) return reject(err);
        if (res.statusCode === 404) reject(new Error(`SoundCloud returned 404`));
        resolve(body);
      });
    });
  }

  _getAll(url, all, resolve, { linked_partitioning=1, limit=200, ...other }={}) {
    const queryString = {linked_partitioning, limit, ...other};
    this._get(url, queryString)
      .then(data => {
        all = all.concat(data.collection);
        if (data.next_href) this._getAll(data.next_href, all, resolve);
        else resolve(all);
      });
  }

}
