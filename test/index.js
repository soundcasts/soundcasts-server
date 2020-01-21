const tape = require('tape');

const testConfig = require('../config/test.json');
const TestSoundCloud = require('./test-soundcloud-api.js');

require('./util.js');

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
