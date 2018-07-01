'use strict';

// Load module
import MSFramework from './../../';

// Define framework instance
const MSServerSideServices = MSFramework({
  type: 'server',
});

/*
type: server
- Use babel to transform ES6 to ES5 before executing
- Allow custom babel babel configuration, either use .babelrc or pass babel configuration
- Define an entry point for a micro service
- Bundles all files from the entry point into a minified self executing file
*/

/////////////// SERVER //////////////////

// Define service
MSServerSideServices.defineService({
  name: 'omit-object-props',
  entryPoint: './lib/omitObjectProps.js',
  babel: {
    presets: ['env'],
  },
});

////////////////// BROWSER ///////////////
