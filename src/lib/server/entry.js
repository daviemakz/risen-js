'use strict';

const deepMerge = require('deepmerge');

const { rcConfig } = require('../../../babel.config.base');

const { babelConfig } = JSON.parse(process.env.options);

require('@babel/register')(deepMerge(rcConfig, babelConfig));

module.exports = require('./index');
