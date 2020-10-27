'use strict';
var _util = require('./util');
Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports['default'] = void 0);
function _classCallCheck(a, b) {
  if (!(a instanceof b))
    throw new TypeError('Cannot call a class as a function');
}
function _defineProperties(a, b) {
  for (var c, d = 0; d < b.length; d++)
    (c = b[d]),
      (c.enumerable = c.enumerable || !1),
      (c.configurable = !0),
      'value' in c && (c.writable = !0),
      Object.defineProperty(a, c.key, c);
}
function _createClass(a, b, c) {
  return (
    b && _defineProperties(a.prototype, b), c && _defineProperties(a, c), a
  );
}
var logTypes = ['log', 'error', 'warn'],
  ServiceCommon = (function () {
    function a() {
      var b = this;
      return (
        _classCallCheck(this, a),
        ['log', 'destroyConnection', 'executeInitialFunctions'].forEach(
          function (a) {
            b[a] = b[a].bind(b);
          }
        ),
        this
      );
    }
    return (
      _createClass(a, [
        {
          key: 'log',
          value: function log(a, b) {
            var c =
              !!(2 < arguments.length && void 0 !== arguments[2]) &&
              arguments[2];
            'function' == typeof this.writeToLogFile && this.writeToLogFile(a),
              (this.settings.verbose || c) &&
                logTypes.includes(b) &&
                console[b](a);
          }
        },
        {
          key: 'executeInitialFunctions',
          value: function executeInitialFunctions(a) {
            var b = this,
              c =
                1 < arguments.length && void 0 !== arguments[1]
                  ? arguments[1]
                  : 'options',
              d = 'true' === process.env.service,
              e = {
                request: this.request,
                requestChain: this.requestChain,
                sendRequest: this.sendRequest,
                destroyConnection: this.destroyConnection,
                operations: this[a]
              },
              f = (0, _util.buildResponseFunctions)(void 0, {}, e);
            return new Promise(function (e, g) {
              try {
                return (
                  b[c].runOnStart
                    .filter(function (c) {
                      return (
                        'function' == typeof b[a][c] ||
                        (b.log(
                          'This not a valid function: '
                            .concat(
                              c || 'undefined or empty string',
                              '. Check that its been added to the '
                            )
                            .concat(
                              d
                                ? 'object of functions in your operations path'
                                : 'coreOperations object when you initialised Risen.JS'
                            ),
                          'warn'
                        ),
                        !1)
                      );
                    })
                    .forEach(function (c) {
                      Object.prototype.hasOwnProperty.call(b[a], c)
                        ? (b.log(
                            'Executing the run on start function: '.concat(c),
                            'log'
                          ),
                          b[a][c](f))
                        : g(
                            Error(
                              'The function '.concat(
                                c,
                                ' has not been defined in this service!'
                              )
                            )
                          );
                    }),
                  e()
                );
              } catch (a) {
                return b.log(a, 'error'), g(Error(a));
              }
            });
          }
        },
        {
          key: 'destroyConnection',
          value: function destroyConnection(a, b) {
            return Object.prototype.hasOwnProperty.call(a, 'conn')
              ? (a.conn.destroy(),
                this.log(
                  '['.concat(b, '] Connection successfully closed'),
                  'log'
                ))
              : this.log(
                  '['.concat(
                    b,
                    '] Connection object untouched. invalid object...'
                  ),
                  'log'
                );
          }
        }
      ]),
      a
    );
  })(),
  _default = ServiceCommon;
exports['default'] = _default;
