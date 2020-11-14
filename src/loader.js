'use strict';

const loadModule = (path, options) => {
  const { babelConfig } = options;
  if (Object.keys(babelConfig || {})) {
    require('@babel/register')(babelConfig);
  }
  return require(path);
};

module.exports = loadModule;
