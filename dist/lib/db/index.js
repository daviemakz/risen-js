'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = void 0;

var _quick = _interopRequireDefault(require('quick.db'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

var FrameworkDatabase = function FrameworkDatabase(options) {
  _classCallCheck(this, FrameworkDatabase);

  this.db = new _quick['default'].table(options.databaseName);
  return this;
};

var _default = FrameworkDatabase;
exports['default'] = _default;
