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
    setDestination(value) {
      assignProp(this, 'destination', value);
    },
    setFuncName(value) {
      assignProp(this, 'functionName', value);
    },
    setBody(body) {
      this.body = body;
    }
  };
}

export default getCommandBody;
