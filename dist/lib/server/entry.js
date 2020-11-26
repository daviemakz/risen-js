'use strict';

var _JSON$parse = JSON.parse(process.env.options),
    babelConfig = _JSON$parse.babelConfig;

if (Object.keys(babelConfig).length) {
  require('@babel/register')(babelConfig);
}

module.exports = require("./index");