'use strict';

// Assign variables
const presets = ['@babel/preset-env'];
const plugins = [
  '@babel/plugin-transform-regenerator',
  '@babel/plugin-syntax-throw-expressions',
  '@babel/plugin-transform-modules-commonjs'
];

// Babel configuration
const rcConfig = {
  comments: false,
  presets,
  plugins
};

// Export
module.exports = function(api) {
  api.cache(true);
  return {
    env: {
      test: rcConfig,
      development: rcConfig
    }
  };
};
