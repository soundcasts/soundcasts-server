import test from 'tape';

import config from '../lib/config';
import SoundCloud from '../lib/SoundCloud';

const clientId = config.soundcloud.clientId;

const USER_ID = 'hannah_wants';

test('SoundCloud constructor', t => {
  var sc = new SoundCloud(clientId);
  t.equal(sc.clientId, clientId, 'correct clientId set in instance');
  t.end();
});

test('SoundCloud constructor', t => {
  t.throws(() => new SoundCloud(), /clientId is required/, 
    'throws correct error if no clientId supplied');
  t.end();
});

test('SoundCloud getUser method', async t => {
  var sc = new SoundCloud(clientId);
  var user = await sc.getUser(USER_ID);
  t.equal(user.username, 'Hannah Wants', 'expected username found');
  t.end();
});

test('SoundCloud getTracks method', async t => {
  var sc = new SoundCloud(clientId);
  var tracks = await sc.getTracks(USER_ID);
  var track = tracks[tracks.length - 1];
  t.equal(track.title, 'Hannah Wants - Ibiza 2010 Reminiscence Mix',
    'expected track found');
  t.end();
});
