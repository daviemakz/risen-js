'use strict';
var deepMerge = require('deepmerge'),
  _require = require('../../../babel.config.base'),
  rcConfig = _require.rcConfig,
  _JSON$parse = JSON.parse(process.env.options),
  babelConfig = _JSON$parse.babelConfig;
require('@babel/register')(deepMerge(rcConfig, babelConfig)),
  (module.exports = require('./index'));
