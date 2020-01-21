const deepExtend = require('deep-extend');

const common = require('../config/common.json');
const test = require('../config/test.json');
const production = require('../config/production.json');

const envConfigs = { test, production };
module.exports = deepExtend(common, envConfigs[process.env.NODE_ENV]);
