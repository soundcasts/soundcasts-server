import assert from 'assert';

import constants from '../../lib/constants';
import SoundCloud from '../../lib/SoundCloud';


const CLIENT_ID = constants.CLIENT_ID;
const USER_ID = 'hannah_wants';


describe("SoundCloud", () => {

  describe("#constructor()", () => {
    it("should create an instance", () => {
      var sc = new SoundCloud(CLIENT_ID);
      assert.equal(sc.clientId, CLIENT_ID);
    });
    it("should raise an error if no clientId is supplied", () => {
      assert.throws(
        () => {
          new SoundCloud();
        },
        /clientId is required/
      );
    });
  });

  describe("#getUser()", () => {
    it("should get the user", async () => {
      var user = await _sc().getUser(USER_ID);
      assert.equal(user.username, 'Hannah Wants');
    });
  });

  describe("#getTracks()", () => {
    it("should get the user's tracks", async () => {
      var tracks = await _sc().getTracks(USER_ID);
      var track = tracks[tracks.length - 1];
      assert.equal(track.title, 'Hannah Wants - Ibiza 2010 Reminiscence Mix');
    });
  });

});


function _sc() {
  return new SoundCloud(CLIENT_ID);
}
