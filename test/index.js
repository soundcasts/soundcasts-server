require('babel/register');
var tape = require('tape');
var express = require('express');
var nineTrack = require('nine-track');

var soundCloud = express().use(nineTrack({
  url: 'https://api.soundcloud.com',
  fixtureDir: 'test/fixtures'
}));

tape('setup', (t) => {
  server = soundCloud.listen(1337);
  t.end();
});

require('./soundcast');
require('./soundcloud');

tape('teardown', (t) => {
  server.close();
  t.end();
});
