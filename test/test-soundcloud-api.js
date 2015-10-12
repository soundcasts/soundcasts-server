import express from 'express';
import nineTrack from 'nine-track';

import {SOUNDCLOUD_API_URL} from '../lib/constants';


export default class TestSoundCloud {

  start(port) {
    this.server = express().use(nineTrack({
      url: SOUNDCLOUD_API_URL,
      fixtureDir: 'test/fixtures'
    })).listen(port);
  }

  stop() {
    this.server.close();
  }

}
