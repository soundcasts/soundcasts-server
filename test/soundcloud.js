import test from 'tape';

import config from '../lib/config.js';
import SoundCloud from '../lib/soundcloud.js';


const CLIENT_ID = config.soundcloud.clientId;
const USER_ID = 'hannah_wants';


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
  const user = await soundcloud.getUser(USER_ID);
  t.equal(user.username, 'Hannah Wants', 'expected username found');
  t.end();
});

test('soundcloud getTracks method', async t => {
  const sc = new SoundCloud(CLIENT_ID);
  const tracks = await sc.getTracks(USER_ID);
  const track = tracks[tracks.length - 1];
  t.equal(track.title, 'Hannah Wants - Ibiza 2010 Reminiscence Mix', 'expected track found');
  t.end();
});
