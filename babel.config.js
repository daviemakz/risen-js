'use strict';

// Import base configs
const { rcConfigTest, rcConfigMinify } = require('./babel.config.base');

// Export
module.exports = (api) => {
  api.cache(true);
  return {
    env: {
      test: rcConfigTest,
      development: rcConfigTest,
      production: rcConfigMinify
    }
  };
};
