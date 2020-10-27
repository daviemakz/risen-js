'use strict';
Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports.randomScheduling = exports.handleOnData = exports.handleReplyToSocket = exports.processStdio = exports.findAFreePort = exports.executePromisesInOrder = exports.buildResponseFunctions = void 0);
var _findFreePort = _interopRequireDefault(require('find-free-port')),
  _response = _interopRequireDefault(require('./template/response'));
function _interopRequireDefault(a) {
  return a && a.__esModule ? a : { default: a };
}
function _typeof(a) {
  '@babel/helpers - typeof';
  return (
    (_typeof =
      'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
        ? function (a) {
            return typeof a;
          }
        : function (a) {
            return a &&
              'function' == typeof Symbol &&
              a.constructor === Symbol &&
              a !== Symbol.prototype
              ? 'symbol'
              : typeof a;
          }),
    _typeof(a)
  );
}
function ownKeys(a, b) {
  var c = Object.keys(a);
  if (Object.getOwnPropertySymbols) {
    var d = Object.getOwnPropertySymbols(a);
    b &&
      (d = d.filter(function (b) {
        return Object.getOwnPropertyDescriptor(a, b).enumerable;
      })),
      c.push.apply(c, d);
  }
  return c;
}
function _objectSpread(a) {
  for (var b, c = 1; c < arguments.length; c++)
    (b = null == arguments[c] ? {} : arguments[c]),
      c % 2
        ? ownKeys(Object(b), !0).forEach(function (c) {
            _defineProperty(a, c, b[c]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(a, Object.getOwnPropertyDescriptors(b))
        : ownKeys(Object(b)).forEach(function (c) {
            Object.defineProperty(a, c, Object.getOwnPropertyDescriptor(b, c));
          });
  return a;
}
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
var buildResponseFunctions = function (a, b, c) {
  var d = b.data,
    e = new _response['default']();
  return _objectSpread(
    {
      data: d,
      command: b,
      sendSuccess: function sendSuccess(b) {
        var c = b.result,
          d = void 0 === c ? null : c,
          f = b.code,
          g = b.message;
        return e.success({ data: d, code: f, message: g }), a && a.reply(e);
      },
      sendError: function sendError(b) {
        var c = b.result,
          d = void 0 === c ? null : c,
          f = b.code,
          g = b.message;
        return e.error({ data: d, code: f, message: g }), a && a.reply(e);
      }
    },
    c
  );
};
exports.buildResponseFunctions = buildResponseFunctions;
var executePromisesInOrder = function (a) {
  return a.reduce(function (a, b) {
    return a.then(
      function (a) {
        return b().then(Array.prototype.concat.bind(a));
      },
      function (a) {
        throw new Error(a);
      }
    );
  }, Promise.resolve([]));
};
exports.executePromisesInOrder = executePromisesInOrder;
var findAFreePort = function (a) {
  return new Promise(function (b) {
    return (0,
    _findFreePort[
      'default'
    ])(a.settings.portRangeStart, a.settings.portRangeFinish, function (a, c) {
      return b(c);
    });
  });
};
exports.findAFreePort = findAFreePort;
var processStdio = function (a, b, c) {
  return (
    '[Child process: '
      .concat(b, '] Micro service - ')
      .concat(a, ': ')
      .concat('object' === _typeof(c) ? JSON.stringify(c, null, 2) : c) || ''
  ).trim();
};
exports.processStdio = processStdio;
var handleReplyToSocket = function (a, b) {
  var c = !!(2 < arguments.length && void 0 !== arguments[2]) && arguments[2];
  return b.reply(a), c && b.conn.destroy();
};
exports.handleReplyToSocket = handleReplyToSocket;
var handleOnData = function (a, b, c) {
  return function (d, e, f) {
    var g = processStdio(
      ''.concat(d, '/port:').concat(b, '/id:').concat(c),
      e,
      f
    );
    a.writeToLogFile(g), a.log(g, 'log');
  };
};
exports.handleOnData = handleOnData;
var randomScheduling = function (a) {
  var b = Math.floor(Math.random() * a.length);
  return [a[b], b];
};
exports.randomScheduling = randomScheduling;
