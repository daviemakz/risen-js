'use strict';

// Import base configs
const { rcConfig } = require('./babel.config.base');

// Export
module.exports = (api) => {
  api.cache(true);
  return {
    env: {
      test: rcConfig,
      development: rcConfig
    }
  };
};
