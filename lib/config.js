import deepExtend from 'deep-extend';

import common from '../config/common.json';
import test from '../config/test.json';
import production from '../config/production.json';

const envConfigs = {test, production};

export default deepExtend(common, envConfigs[process.env.NODE_ENV]);
