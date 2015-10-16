import request from 'request';

import {soundcloud} from './config';

const soundcloudUrl = soundcloud.port ?
  `${soundcloud.host}:${soundcloud.port}` : soundcloud.host;

export default class SoundCloud {

  constructor(clientId) {
    if (!clientId) throw new Error('clientId is required');
    this.clientId = clientId;
  }

  async getUser(userId) {
    var url = `${soundcloudUrl}/users/${userId}`;
    return this._get(url);
  }

  async getTracks(userId) {
    var tracks = [];
    return new Promise(resolve => {
      var url = `${soundcloudUrl}/users/${userId}/tracks`;
      this._getAll(url, tracks, resolve);
    });
  }

  async _get(url, {client_id = this.clientId, format = 'json', ...other} = {}) {
    var options = {
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

  async _getAll(url, all, resolve, {linked_partitioning = 1, limit = 200, ...other} = {}) {
    var queryString = {linked_partitioning, limit, ...other};
    this._get(url, queryString)
      .then(data => {
        all = all.concat(data.collection);
        if (data.next_href) this._getAll(data.next_href, all, resolve);
        else resolve(all);
      });
  }

}
