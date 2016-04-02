import tape from 'tape';

import testConfig from '../config/test.json';
import TestSoundCloud from './test-soundcloud-api.js';

import './util.js';

const testPort = testConfig.soundcloud.port;
const testServer = new TestSoundCloud();

tape('mock soundcloud setup', t => {
  testServer.start(testPort);
  t.end();
});

require('./soundcast');
require('./soundcloud');

tape('mock soundcloud teardown', t => {
  testServer.stop();
  t.end();
});
