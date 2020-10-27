'use strict';
Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports['default'] = void 0);
var networkBase = (function () {
  function a() {
    this.savedBuffer = '';
  }
  return (
    (a.prototype.getHostByAddress = function (a) {
      return 'number' == typeof a
        ? null
        : 'string' == typeof a
        ? a.split(':')[0]
        : void 0;
    }),
    (a.prototype.getPortByAddress = function (a) {
      return 'number' == typeof a
        ? a
        : 'string' == typeof a
        ? a.split(':')[1]
        : void 0;
    }),
    (a.prototype.prepareJsonToSend = function (a) {
      return ''.concat(JSON.stringify(a), '\0');
    }),
    (a.prototype.tokenizeData = function (a) {
      var b;
      return ((this.savedBuffer += a),
      (b = this.savedBuffer.split('\0')),
      b.pop())
        ? []
        : ((this.savedBuffer = ''), b);
    }),
    a
  );
})();
var _default = networkBase;
exports['default'] = _default;
