import test from 'tape';

import * as util from '../lib/util.js';


test('formatDuration', t => {
  const f = util.formatDuration;
  t.equal(f('0'), '00:00:00');
  t.equal(f(1000), '00:00:01');
  t.equal(f(60 * 1000), '00:01:00');
  t.equal(f(60 * 60 * 1000), '01:00:00');
  t.equal(f(60 * 60 * 24 * 1000 - 1000), '23:59:59');
  t.end();
});


test('makeUrl', t => {
  const f = util.makeUrl;

  const req = {
    protocol: 'http',
    get: () => 'fake-host.com',
    path: '/some-path',
    query: { query: 'string?' }
  };
  t.equal(f(req), 'http://fake-host.com/some-path?query=string%3F');

  const extra = {
    protocol: 'https',
    get: () => 'some-other-fake-host.com',
    path: '/some-other-path',
    query: { query: 'some-other-string?' }
  };
  t.equal(f(req, extra), 'https://some-other-fake-host.com/some-other-path?query=some-other-string%3F');

  t.end();
});


test('queryString', t => {
  const f = util.queryString;
  t.equal(f({}), '');
  t.equal(f({ string: 'string' }), '?string=string');
  t.equal(f({ string: 'string?' }), '?string=string%3F');
  t.equal(f({ true: true }), '?true=true');
  t.equal(f({ false: false }), '?false=false');
  t.equal(f({ number: 123 }), '?number=123');
  t.equal(f({ null: null }), '?null=null');
  t.equal(f({ nan: NaN }), '?nan=NaN');
  t.end();
});
