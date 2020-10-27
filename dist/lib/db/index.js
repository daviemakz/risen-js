'use strict';
var _quick = _interopRequireDefault(require('quick.db'));
Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports['default'] = void 0);
function _interopRequireDefault(a) {
  return a && a.__esModule ? a : { default: a };
}
function _classCallCheck(a, b) {
  if (!(a instanceof b))
    throw new TypeError('Cannot call a class as a function');
}
var FrameworkDatabase = function a(b) {
    return (
      _classCallCheck(this, a),
      (this.db = new _quick['default'].table(b.databaseName)),
      this
    );
  },
  _default = FrameworkDatabase;
exports['default'] = _default;
