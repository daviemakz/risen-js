'use strict';

// Load NPM modules
import QuickDB from 'quick.db';

// Define class
class FrameworkDatabase {
  constructor(options) {
    this.db = new QuickDB.table(options.databaseName);
    return this;
  }
}

module.exports = FrameworkDatabase;
