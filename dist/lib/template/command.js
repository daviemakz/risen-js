'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var assignProp = function assignProp(self, name, value) {
  if (typeof value === 'string') {
    return Object.assign(self, _defineProperty({}, name, value));
  }

  throw new Error("'destination' must be a string!");
};

function getCommandBody() {
  return {
    destination: void 0,
    functionName: '',
    body: null,
    source: null,
    conId: null,
    setDestination: function setDestination(value) {
      assignProp(this, 'destination', value);
    },
    setFuncName: function setFuncName(value) {
      assignProp(this, 'functionName', value);
    },
    setBody: function setBody(body) {
      this.body = body;
    },
    setConnectionId: function setConnectionId(id) {
      this.conId = id;
    },
    setCommandSource: function setCommandSource() {
      var _this$settings;

      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        name: process.env.name || 'serviceCore',
        pid: process.pid,
        instanceId: process.env.instanceId || null,
        address: process.env.address ? process.env.address : this === null || this === void 0 ? void 0 : (_this$settings = this.settings) === null || _this$settings === void 0 ? void 0 : _this$settings.address
      },
          name = _ref.name,
          pid = _ref.pid,
          instanceId = _ref.instanceId,
          address = _ref.address;

      this.source = {
        name: name,
        pid: pid,
        address: address,
        instanceId: instanceId
      };
    }
  };
}

var _default = getCommandBody;
exports["default"] = _default;