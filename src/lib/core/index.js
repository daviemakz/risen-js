'use strict';

// Load Templates
import ResponseBodyObject from './../template/response';

// FUNCTION: Get a unique array
const uniqueArray = arrArg => {
  return arrArg.filter((elem, pos, arr) => arr.indexOf(elem) === pos);
};

// FUNCTION: Get a random list of elements from array
const getRandomElements = (arr, n) => {
  let ln = n;
  const result = new Array(ln);
  let len = arr.length;
  const taken = new Array(len);
  if (ln > len) {
    throw new RangeError('getRandom: more elements taken than available');
  }
  while (ln--) {
    const x = Math.floor(Math.random() * len);
    result[ln] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

// FUNCTION: Start service instance wrapper
function startService(serviceInfo, instances) {
  return this.startServices(serviceInfo, instances);
}

// FUNCTION:Stop service instance wrapper
function stopService(name, instances) {
  return new Promise((resolve, reject) => {
    // Get highest number of instances which can be shutdown
    const requestedInstances = Math.abs(instances);
    const actualInstances = this.serviceData[name].port.length;
    const instancesToTerminate = requestedInstances > actualInstances ? actualInstances : requestedInstances;
    // If instance count is 0 then just resolve
    if (instancesToTerminate === 0) {
      return resolve(void 0);
    }
    // Get ports to close
    const ports = getRandomElements(this.serviceData[name].port, instancesToTerminate);
    // Assign ports which are being shutdown
    process.env.exitedProcessPorts = uniqueArray([].concat(process.env.exitedProcessPorts, ports));
    (typeof process.env.exitedProcessPorts === 'string'
      ? process.env.exitedProcessPorts.split(',')
      : process.env.exitedProcessPorts
    )
      .map(port => parseInt(port, 10))
      .filter(exitedPort => typeof exitedPort === 'number');
    // Process indexes
    const processIndexes = ports.map(port => this.getProcessIndex(name, port));
    // Process exiter
    try {
      processIndexes.forEach(
        async (index, elIndex) =>
          await new Promise((resolve, reject) => {
            // Show message
            this.log(`Service core will send kill command to the service: ${name}/port:${ports[elIndex]}`, 'log');
            // Send kill process message
            this.serviceData[name].socket[index].request('SERVICE_KILL', void 0, res => {
              this.log(
                `Service core has recieved acknowledgement of kill command from: ${name}/port:${ports[elIndex]}`,
                'log'
              );
              res.status.command.code === 100 ? resolve(true) : reject(false);
            });
          })
      );
      // Resolve
      return resolve(void 0);
    } catch (e) {
      return reject(e);
    }
  });
}

// EXPORTS
module.exports = {
  storage: function(socket, data) {
    // Invoke Template(s)
    const resObject = new ResponseBodyObject();
    // Build Response Object [status - transport]
    resObject.status.transport.responseSource = process.env.name;
    // Perform operations
    return setTimeout(
      () =>
        this.databaseOperation(data.body.table, data.body.method, data.body.args, (status, result, error) => {
          // Assign function result
          if (status) {
            resObject.resultBody.resData = {
              status: true,
              message: 'The operation completed successfully!',
              result
            };
          } else {
            resObject.resultBody.resData = {
              status: false,
              message: 'The operation failed!',
              result,
              error
            };
            resObject.resultBody.errData = error;
          }
          // Return
          return socket.reply(resObject);
        }),
      0
    );
  },
  changeInstances: async function(socket, data) {
    // Invoke Template(s)
    const resObject = new ResponseBodyObject();
    // Base response
    const baseResponse = {
      error: null,
      details: {}
    };
    // Build Response Object [status - transport]
    resObject.status.transport.responseSource = process.env.name;
    // Check if the service has already been defined
    if (!Object.keys(this.serviceInfo).includes(data.body.name)) {
      // Build Response Object [ResBody - command Details]
      resObject.resultBody.errData = Object.assign(baseResponse, {
        status: false,
        message: `Service "${data.body.name}" was not found!`
      });
    } else if (typeof data.body.instances !== 'number' || data.body.instances === 0) {
      resObject.resultBody.errData = Object.assign(baseResponse, {
        status: false,
        message: '"instance" property must be a number which is not 0!'
      });
    } else {
      // Base response object
      const previousPorts = [].concat(...this.serviceData[data.body.name].port);
      // Get result
      const result =
        data.body.instances > 0
          ? await startService.call(this, { [data.body.name]: this.serviceInfo[data.body.name] }, data.body.instances)
          : await stopService.call(this, data.body.name, data.body.instances);
      // Get next ports
      const nextPorts = this.serviceData[data.body.name].port;
      // Assign response object
      typeof result === 'undefined'
        ? (resObject.resultBody.resData = Object.assign(baseResponse, {
            status: true,
            message: 'Services were modified successfully!',
            details: {
              name: data.body.name,
              previousPorts,
              nextPorts
            }
          }))
        : (resObject.resultBody.errData = Object.assign(baseResponse, {
            status: false,
            message: 'Services modification failed!',
            details: {
              name: data.body.name,
              previousPorts,
              nextPorts
            }
          }));
    }
    // Respond To Source
    return socket.reply(resObject);
  }
};
