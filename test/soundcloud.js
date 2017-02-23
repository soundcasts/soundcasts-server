import test from 'tape';

import config from '../src/config.js';
import SoundCloud from '../src/soundcloud.js';


const CLIENT_ID = config.soundcloud.clientId;
const username = 'anjunadeep';
const userId = '237204';


test('soundcloud constructor', t => {
  const soundcloud = new SoundCloud(CLIENT_ID);
  t.equal(soundcloud.clientId, CLIENT_ID, 'correct clientId set in instance');
  t.end();
});

test('soundcloud constructor', t => {
  t.throws(() => new SoundCloud(), /clientId is required/, 'throws correct error if no clientId supplied');
  t.end();
});

test('soundcloud getUser method', async t => {
  const soundcloud = new SoundCloud(CLIENT_ID);
  const user = await soundcloud.getUser(username);
  t.equal(user.username, 'Anjunadeep', 'expected username found');
  t.end();
});

test('soundcloud getTracks method', async t => {
  const sc = new SoundCloud(CLIENT_ID);
  const tracks = await sc.getTracks(userId);
  const track = tracks[tracks.length - 1];
  t.equal(track.title, 'Michael Cassette - Shadows Movement', 'expected track found');
  t.end();
});
