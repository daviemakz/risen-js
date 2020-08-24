'use strict';

// Load NPM modules
import Database from 'quick.db';

// Define class
class FrameworkDatabase {
  constructor(options) {
    /* eslint-disable-next-line */
    this.db = new Database.table(options.databaseName);
    return this;
  }
}

export default FrameworkDatabase;
