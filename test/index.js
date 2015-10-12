require('babel/register');

var tape = require('tape');
var TestSoundCloud = require('./test-soundcloud-api');

var testServer = new TestSoundCloud();

tape('setup', t => {
  testServer.start(1337);
  t.end();
});

require('./soundcast');
require('./soundcloud');

tape('teardown', t => {
  testServer.stop();
  t.end();
});
