'use strict';
Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports['default'] = void 0);
function _defineProperty(a, b, c) {
  return (
    b in a
      ? Object.defineProperty(a, b, {
          value: c,
          enumerable: !0,
          configurable: !0,
          writable: !0
        })
      : (a[b] = c),
    a
  );
}
var assignProp = function (a, b, c) {
  if ('string' == typeof c) return Object.assign(a, _defineProperty({}, b, c));
  throw new Error("'destination' must be a string!");
};
function getCommandBody() {
  return {
    destination: void 0,
    functionName: '',
    body: null,
    setDestination: function setDestination(a) {
      assignProp(this, 'destination', a);
    },
    setFuncName: function setFuncName(a) {
      assignProp(this, 'functionName', a);
    },
    setBody: function setBody(a) {
      this.body = a;
    }
  };
}
var _default = getCommandBody;
exports['default'] = _default;
