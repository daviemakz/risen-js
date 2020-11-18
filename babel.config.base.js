'use strict';

// Assign variables
const presets = ['@babel/preset-env'];

const plugins = [
  '@babel/plugin-transform-regenerator',
  '@babel/plugin-syntax-throw-expressions',
  '@babel/plugin-transform-modules-commonjs',
  ['dynamic-import-node-babel-7'],
  [
    'module-resolver',
    {
      alias: {
        '@services': './dev/services'
      }
    }
  ]
];

// Babel configuration
const rcConfigMinify = {
  comments: false,
  presets: presets.concat([
    [
      'minify',
      {
        builtIns: false
      }
    ]
  ]),
  plugins
};

const rcConfigDev = {
  comments: false,
  presets,
  plugins
};

const rcConfigTest = {
  comments: false,
  presets,
  plugins
};

// Export
module.exports = {
  presets,
  plugins,
  rcConfigDev,
  rcConfigMinify,
  rcConfigTest
};
