import express from 'express';
import nineTrack from 'nine-track';

import productionConfig from '../config/production';

const realHost = productionConfig.soundcloud.host;

export default class TestSoundCloud {

  start(port) {
    this.server = express().use(nineTrack({
      url: realHost,
      fixtureDir: 'test/fixtures'
    })).listen(port);
  }

  stop() {
    this.server.close();
  }

}
