'use strict';

const assignProp = (self, name, value) => {
  if (typeof value === 'string') {
    return Object.assign(self, { [name]: value });
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
    setDestination(value) {
      assignProp(this, 'destination', value);
    },
    setFuncName(value) {
      assignProp(this, 'functionName', value);
    },
    setBody(body) {
      this.body = body;
    },
    setConnectionId(id) {
      this.conId = id;
    },
    setCommandSource(
      { name, pid, instanceId, address } = {
        name: process.env.name || 'serviceCore',
        pid: process.pid,
        instanceId: process.env.instanceId || null,
        address: process.env.address
          ? process.env.address
          : this?.settings?.address
      }
    ) {
      this.source = {
        name,
        pid,
        address,
        instanceId
      };
    }
  };
}

export default getCommandBody;
