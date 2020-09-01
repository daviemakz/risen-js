'use strict';

var _require = require('../../../babel.config.base'),
  rcConfig = _require.rcConfig;

require('@babel/register')(rcConfig);

module.exports = require('./index');
