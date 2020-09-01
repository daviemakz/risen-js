'use strict';

const { rcConfig } = require('../../../babel.config.base');

require('@babel/register')(rcConfig);

module.exports = require('./index');
