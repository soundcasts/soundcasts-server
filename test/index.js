require('babel/register');

var tape = require('tape');

var testConfig = require('../config/test');
var TestSoundCloud = require('./test-soundcloud-api');

var testPort = testConfig.soundcloud.port;
var testServer = new TestSoundCloud();

tape('setup', t => {
  testServer.start(testPort);
  t.end();
});

require('./soundcast');
require('./soundcloud');

tape('teardown', t => {
  testServer.stop();
  t.end();
});
