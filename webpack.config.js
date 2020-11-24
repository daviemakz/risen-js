'use strict';

const webpack = require('webpack');
const path = require('path');

const NodemonPlugin = require('nodemon-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = () => {
  /* eslint-disable-next-line */
  const config = {
    mode: 'development',
    target: 'node',
    devtool: 'inline-source-map',
    entry: {
      mock: ['dev/mock.js']
    },
    resolve: {
      symlinks: false,
      modules: [path.resolve(__dirname), 'node_modules', 'dev', 'tmp'],
      extensions: ['.ts', '.json', '.js']
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)$/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          },
          exclude: /(node_modules)/
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }),
      new webpack.IgnorePlugin(/.*\/__tests__\/.*/),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'node_modules/better-sqlite3/',
            to: 'node_modules/better-sqlite3/'
          },
          {
            from: '__resources__/services',
            to: 'dev'
          },
          {
            from: '__resources__/public',
            to: 'dev/public'
          },
          {
            from: '__resources__/httpsPublic',
            to: 'dev/httpsPublic'
          }
        ]
      }),
      new NodemonPlugin({
        script: './tmp/dev/index.js',
        watch: path.resolve('.'),
        ext: 'ts,js,json',
        verbose: true
      })
    ],
    externals: {
      'better-sqlite3': 'commonjs better-sqlite3'
    },
    output: {
      path: `${__dirname}/tmp`,
      filename: 'dev/[name].js'
    }
  };

  return config;
};
