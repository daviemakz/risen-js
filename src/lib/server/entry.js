'use strict';

const { babelConfig } = JSON.parse(process.env.options);

// Transpile the code if you need to
if (Object.keys(babelConfig).length) {
  require('@babel/register')(babelConfig);
}

module.exports = require('./index');
