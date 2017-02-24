import express from 'express';
import yakbak from 'yakbak';

import productionConfig from '../config/production.json';


const realHost = productionConfig.soundcloud.host;

export default class TestSoundCloud {

  start(port) {
    this.server = express().use(yakbak(realHost, {
      dirname: __dirname + '/fixtures'
    })).listen(port);
  }

  stop() {
    this.server.close();
  }

}
