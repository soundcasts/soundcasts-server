const express = require('express');
const yakbak = require('yakbak');

const productionConfig = require('../config/production.json');


const realHost = productionConfig.soundcloud.host;

module.exports = class TestSoundCloud {

  start(port) {
    this.server = express().use(yakbak(realHost, {
      dirname: __dirname + '/fixtures'
    })).listen(port);
  }

  stop() {
    this.server.close();
  }

}
