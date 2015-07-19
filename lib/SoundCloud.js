import request from 'request';


const SOUNDCLOUD = {
  BASE: 'https://api.soundcloud.com'
};


export default class SoundCloud {

  constructor(clientId) {
    if (!clientId) throw Error('clientId is required');
    this.clientId = clientId;
  }


  searchUsers(query) {
    var url = SOUNDCLOUD.BASE + '/users';
    return this.get(url, {q: query})
      .then((users) => {
        return users.filter(u => u.track_count > 0);
      });
  }


  getUser(userId) {
    var url = `${SOUNDCLOUD.BASE}/users/${userId}`;
    return this.get(url);
  }


  getTracks(userId) {
    var tracks = [];
    return new Promise((resolve) => {
      var url = `${SOUNDCLOUD.BASE}/users/${userId}/tracks`;
      this.getAll(url, tracks, resolve);
    });
  }


  getAll(url, all, resolve, queryString = {}) {
    var defaults = {
      linked_partitioning: 1,
      limit: 200
    };
    queryString = Object.assign({}, defaults, queryString);
    this.get(url, queryString)
      .then((data) => {
        all = all.concat(data.collection);
        if (data.next_href) this.getAll(data.next_href, all, resolve);
        else resolve(all);
      });
  }


  get(url, query = {}) {
    var defaultQs = {
      client_id: this.clientId,
      format: 'json'
    };
    var options = {
      url: url,
      qs: Object.assign({}, query, defaultQs),
      json: true
    };
    console.log(`get(${url}, ${JSON.stringify(options.qs)})`);
    return new Promise((resolve, reject) => {
      request.get(options, (err, res, body) => {
        if (err) return reject(err);
        resolve(body);
      });
    });
  }

}
