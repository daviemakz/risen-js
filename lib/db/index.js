'use strict';

// Load NPM modules
const db = require('quick.db');

// Define class
class FrameworkDatabase {
  constructor(options) {
    this.db = new db.table(options.databaseName);
    return this;
  }
}

module.exports = FrameworkDatabase;
