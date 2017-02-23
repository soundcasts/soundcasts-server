import test from 'tape';

import config from '../src/config.js';
import { getSoundcast, soundcastToXml } from '../src/soundcast.js';


const TIMEOUT = { timeout: 20000 };
const CLIENT_ID = config.soundcloud.clientId;
const QUERY = {
  title: 'The Anjunadeep Edition',
  userId: 'anjunadeep',
  regexString: 'the anjunadeep edition'
};
const REQ = {
  protocol: 'http',
  get: () => 'localhost:3000', // hack so that req.get('host') works during the test
  path: '/soundcast',
  query: QUERY
};


test('getSoundcast', TIMEOUT, t => {
  getSoundcast(QUERY).then(soundcast => {
    t.equal(soundcast.title, QUERY.title, 'soundcast has title');
    t.equal(soundcast.username, QUERY.userId, 'soundcast has username');
    t.equal(soundcast.regexString, QUERY.regexString, 'soundcast has regexString');
    t.end();
  });
});

test('getSoundcast required params', TIMEOUT, t => {
  t.plan(3);

  const expectedError = 'userId, title, regexString are required';
  const queryParams = ['userId', 'title', 'regexString'];

  queryParams.forEach(param => {
    const params = Object.assign({}, QUERY);
    params[param] = '';
    getSoundcast(params).catch(err => t.equal(err, expectedError, 'throws correct error if required params are not supplied'));
  });
});

test('getSoundcast default regexString', TIMEOUT, t => {
  const query = Object.assign({}, QUERY);
  delete query.regexString;
  const req = Object.assign({}, REQ);
  req.query = query;

  getSoundcast(query).then(soundcast => {
    t.equal(soundcast.title, QUERY.title);
    t.equal(soundcast.username, QUERY.userId);
    t.equal(soundcast.regexString, '.*');
    t.end();
  });
});

test('Soundcast channel data', TIMEOUT, t => {
  getSoundcast(QUERY).then(soundcast => {
    t.equal(soundcast.title, QUERY.title);
    t.equal(soundcast.author, 'Anjunadeep');
    t.equal(soundcast.link, 'http://soundcloud.com/anjunadeep');
    t.equal(/Anjunadeep/.test(soundcast.description), true);
    t.equal(soundcast.image, 'https://i1.sndcdn.com/avatars-000279191688-kpcox9-t200x200.jpg');

    const track = soundcast.tracks[soundcast.tracks.length - 1];
    t.equal(track.title, 'The Anjunadeep Edition 255 with James Grant');
    t.equal(/Anjunadeep/.test(track.description), true);
    t.equal(track.duration, '01:58:35');
    t.equal(track.url, 'https://api.soundcloud.com/tracks/30497648/stream?client_id=' + CLIENT_ID);
    t.equal(track.size, 1);
    t.equal(track.fileFormat, 'mp3');
    t.equal(track.httpFormat, 'audio/mpeg');
    t.equal(track.published, 'Tue, 13 Dec 2011 10:37:14 +0000');
    t.end();
  });
});

test('Soundcast XML output', TIMEOUT, t => {
  getSoundcast(QUERY).then(soundcast => {
    const xml = soundcastToXml(soundcast, REQ);
    t.assert(xml.length > 1000, true, 'lots of XML');
    t.end();
  });
});
