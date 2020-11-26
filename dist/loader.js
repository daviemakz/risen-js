'use strict';

var loadModule = function loadModule(path, options) {
  var babelConfig = options.babelConfig;

  if (Object.keys(babelConfig || {})) {
    require('@babel/register')(babelConfig);
  }

  return require(path);
};

module.exports = loadModule;