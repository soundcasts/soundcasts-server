import assert from 'assert';

import constants from '../../lib/constants';
import Soundcast from '../../lib/Soundcast';


const CLIENT_ID = constants.CLIENT_ID;
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


describe("Soundcast", () => {

  describe("#constructor()", () => {
    it("should create an instance", () => {
      var sc = _sc();
      assert.equal(sc.title, QUERY.title);
      assert.equal(sc.userId, QUERY.userId);
      assert.equal(sc.regexString, QUERY.regexString);
    });

    it("should have the right regexString default", () => {
      var noRegexStringQuery = Object.assign({}, QUERY);
      delete noRegexStringQuery.regexString;
      var noRegexStringRequest = Object.assign({}, REQ);
      noRegexStringRequest.query = noRegexStringQuery;
      var sc = new Soundcast(noRegexStringRequest);
      assert.equal(sc.title, QUERY.title);
      assert.equal(sc.userId, QUERY.userId);
      assert.equal(sc.regexString, '.*');
    });
  });

  describe("#getChannelData()", () => {
    it("should get the right channel data", async () => {
      var sc = _sc();

      var channel = await sc.getChannelData();
      assert.equal(channel.title, QUERY.title);
      assert.equal(channel.author, 'Hannah Wants');
      assert.equal(channel.link, 'http://soundcloud.com/hannah_wants');
      assert(channel.description.match(/Hannah Wants/));
      assert.equal(channel.image, 'http://i1.sndcdn.com/avatars-000153476543-el6fm5-t200x200.jpg');

      var track = channel.tracks[channel.tracks.length - 1];
      assert.equal(track.title, 'Hannah Wants: Mixtape 0212');
      assert(track.description.match(/FEBRUARY 2012/));
      assert.equal(track.duration, '01:19:54');
      assert.equal(track.url, 'https://api.soundcloud.com/tracks/36589477/stream?client_id=83d37608cef935bb382915730917bb7d');
      assert.equal(track.size, 1);
      assert.equal(track.fileFormat, 'mp3');
      assert.equal(track.httpFormat, 'audio/mpeg');
      assert.equal(track.published, 'Tue, 14 Feb 2012 13:56:32 +0000');
    });
  });

  describe("#toXml()", () => {
    it("should output lots of XML", async () => {
      var sc = _sc();
      await sc.getChannelData();

      var xml = sc.toXml();
      assert(xml.length > 1000);
    });
  });

});


function _sc() {
  return new Soundcast(REQ);
}
