import test from 'tape';

import config from '../lib/config';
import Soundcast from '../lib/Soundcast';

const USER_ID = 'hannah_wants';
const QUERY = {
  title: 'Hannah Wants - Mixtape',
  userId: 'hannah_wants',
  regexString: 'mixtape'
};
const REQ = {
  protocol: 'http',
  get: () => 'localhost:3000', // hack so that req.get('host') works during the test
  path: '/soundcast',
  query: QUERY
};

const clientId = config.soundcloud.clientId;

test('Soundcast constructor', t => {
  var sc = new Soundcast(REQ);
  t.throws(() => new Soundcast({ query: {} }), /title, userId, regexString are required/, 'throws correct error if query params are not supplied');
  t.equal(sc.title, QUERY.title, 'soundcast instance has title');
  t.equal(sc.userId, QUERY.userId, 'soundcast instance has userId');
  t.equal(sc.regexString, QUERY.regexString, 'soundcast instance has regexString');
  t.end();
});

test('Soundcast regexString defaults', t => {
  var noRegexStringQuery = Object.assign({}, QUERY);
  delete noRegexStringQuery.regexString;
  var noRegexStringRequest = Object.assign({}, REQ);
  noRegexStringRequest.query = noRegexStringQuery;

  var sc = new Soundcast(noRegexStringRequest);
  t.equal(sc.title, QUERY.title);
  t.equal(sc.userId, QUERY.userId);
  t.equal(sc.regexString, '.*');
  t.end();
});

test('Soundcast channel data', async t => {
  var sc = new Soundcast(REQ);
  var channel = await sc.getChannelData();
  t.equal(channel.title, QUERY.title);
  t.equal(channel.author, 'Hannah Wants');
  t.equal(channel.link, 'http://soundcloud.com/hannah_wants');
  t.ok(channel.description.match(/Hannah Wants/));
  t.equal(channel.image, 'http://i1.sndcdn.com/avatars-000153476543-el6fm5-t200x200.jpg');

  var track = channel.tracks[channel.tracks.length - 1];
  t.equal(track.title, 'Hannah Wants: Mixtape 0212');
  t.ok(track.description.match(/FEBRUARY 2012/));
  t.equal(track.duration, '01:19:54');
  t.equal(track.url, 'https://api.soundcloud.com/tracks/36589477/stream?client_id=' + clientId);
  t.equal(track.size, 1);
  t.equal(track.fileFormat, 'mp3');
  t.equal(track.httpFormat, 'audio/mpeg');
  t.equal(track.published, 'Tue, 14 Feb 2012 13:56:32 +0000');
  t.end();
});

test('Soundcast XML output', async t => {
  var sc = new Soundcast(REQ);
  await sc.getChannelData();

  var xml = sc.toXml();
  t.ok(xml.length > 1000, 'lots of XML');
  t.end();
});
