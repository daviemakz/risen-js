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
      { name, pid, instanceId, port } = {
        name: process.env.name || 'serviceCore',
        pid: process.pid,
        instanceId: process.env.instanceId || null,
        port: process.env.port
          ? parseInt(process.env.port, 10)
          : this?.settings?.address
      }
    ) {
      this.source = {
        name,
        pid,
        port,
        instanceId
      };
    }
  };
}

export default getCommandBody;
