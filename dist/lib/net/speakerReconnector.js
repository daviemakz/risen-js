'use strict';
Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports['default'] = void 0);
var _net = _interopRequireDefault(require('net')),
  _networkBase = _interopRequireDefault(require('./networkBase')),
  _constants = require('./constants');
function _interopRequireDefault(a) {
  return a && a.__esModule ? a : { default: a };
}
var extendsObj = function (a, b) {
    function c() {
      this.constructor = a;
    }
    for (var d in b) ({}.hasOwnProperty.call(b, d) && (a[d] = b[d]));
    return (
      (c.prototype = b.prototype),
      (a.prototype = new c()),
      (a.__super__ = b.prototype),
      a
    );
  },
  SpeakerReconnector = (function (a) {
    function b(a) {
      var c, d, e;
      for (
        b.__super__.constructor.call(this),
          this.uniqueId = 1,
          this.sockets = [],
          this.waiters = {},
          this.socketIterator = 0,
          ((d = 0), (e = a.length));
        d < e;
        d++
      )
        (c = a[d]), this.connect(c);
    }
    return (
      extendsObj(b, a),
      (b.prototype.connect = function (a) {
        var b,
          c,
          d,
          e,
          f = this;
        return (
          (d = this),
          (b = this.getHostByAddress(a)),
          (c = this.getPortByAddress(a)),
          (e = new _net['default'].Socket()),
          (e.uniqueSocketId = this.generateUniqueId()),
          e.setEncoding('utf8'),
          e.setNoDelay(!0),
          e.setMaxListeners(1 / 0),
          e.connect(c, b, function () {
            return (
              'true' === process.env.verbose &&
                console.log('Successfully connected on port: '.concat(c)),
              f.sockets.push(e)
            );
          }),
          e.on('data', function (a) {
            var b, c, d, e, g, h;
            for (
              g = f.tokenizeData(a), h = [], ((d = 0), (e = g.length));
              d < e;
              d++
            )
              ((c = g[d]), (b = JSON.parse(c)), !!f.waiters[b.id]) &&
                (f.waiters[b.id](b.data), h.push(delete f.waiters[b.id]));
            return h;
          }),
          e.on('error', function () {}),
          e.on('close', function () {
            if (
              !('string' == typeof process.env.exitedProcessPorts
                ? process.env.exitedProcessPorts.split(',')
                : process.env.exitedProcessPorts
              )
                .map(function (a) {
                  return parseInt(a, 10);
                })
                .includes(c)
            ) {
              'true' === process.env.verbose &&
                console.log('Attempting to connect to port: '.concat(c));
              var b, g, h, i, j;
              for (
                b = 0, j = f.sockets, ((h = 0), (i = j.length));
                h < i && ((g = j[h]), g.uniqueSocketId !== e.uniqueSocketId);
                h++
              )
                b += 1;
              return (
                f.sockets.splice(b, 1),
                e.destroy(),
                setTimeout(function () {
                  return d.connect(a);
                }, 100)
              );
            }
          })
        );
      }),
      (b.prototype.request = function (a, b, c) {
        return null === c && (c = null), this.send(a, b, c);
      }),
      (b.prototype.send = function (a, b, c) {
        var d, e;
        return (null === c && (c = null), 0 === this.sockets.length)
          ? void (c && c({ error: _constants.ERR_REQ_REFUSED }))
          : (this.sockets[this.socketIterator] || (this.socketIterator = 0),
            c && ((d = this.generateUniqueId()), (this.waiters[d] = c)),
            (e = this.prepareJsonToSend({ id: d, subject: a, data: b })),
            this.sockets[this.socketIterator++].write(e));
      }),
      (b.prototype.shout = function (a, b) {
        var c, d, e, f, g, h;
        for (
          c = { subject: a, data: b },
            g = this.sockets,
            h = [],
            ((e = 0), (f = g.length));
          e < f;
          e++
        )
          (d = g[e]), h.push(d.write(this.prepareJsonToSend(c)));
        return h;
      }),
      (b.prototype.generateUniqueId = function () {
        var a, b;
        return ((a = 'id-'.concat(this.uniqueId)), !this.waiters[a])
          ? a
          : (this.uniqueId++ === _constants.MAX_WAITERS && (this.uniqueId = 1),
            this.waiters[(b = 'id-'.concat(this.uniqueId))] &&
              delete this.waiters[b],
            this.generateUniqueId());
      }),
      b
    );
  })(_networkBase['default']),
  _default = SpeakerReconnector;
exports['default'] = _default;
