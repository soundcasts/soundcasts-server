import request from 'request';

import {
  SOUNDCLOUD_API_URL,
  TEST_SOUNDCLOUD_API_URL
} from './constants';

const SC_API = process.env.NODE_ENV === 'test' ?
  TEST_SOUNDCLOUD_API_URL : SOUNDCLOUD_API_URL;

export default class SoundCloud {

  constructor(clientId) {
    if (!clientId) throw new Error('clientId is required');
    this.clientId = clientId;
  }


  async getUser(userId) {
    var url = `${SC_API}/users/${userId}`;
    return this._get(url);
  }


  async getTracks(userId) {
    var tracks = [];
    return new Promise(resolve => {
      var url = `${SC_API}/users/${userId}/tracks`;
      this._getAll(url, tracks, resolve);
    });
  }


  async _get(url, query={}) {
    var defaultQs = {
      client_id: this.clientId,
      format: 'json'
    };
    var options = {
      url: url,
      qs: Object.assign({}, query, defaultQs),
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


  async _getAll(url, all, resolve, queryString={}) {
    var defaults = {
      linked_partitioning: 1,
      limit: 200
    };
    queryString = Object.assign({}, defaults, queryString);
    this._get(url, queryString)
      .then(data => {
        all = all.concat(data.collection);
        if (data.next_href) this._getAll(data.next_href, all, resolve);
        else resolve(all);
      });
  }

}
