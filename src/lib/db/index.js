'use strict';

// Load NPM modules
import Database from 'quick.db';

// Define class
class FrameworkDatabase {
  constructor(options) {
    this.db = new Database.table(options.databaseName);
    return this;
  }
}

module.exports = FrameworkDatabase;
