'use strict';

// Import base configs
const { rcConfigTest, rcConfigDev } = require('./babel.config.base');

// Export
module.exports = (api) => {
  api.cache(true);
  return {
    env: {
      test: rcConfigTest,
      development: rcConfigDev,
      production: rcConfigDev
    }
  };
};
