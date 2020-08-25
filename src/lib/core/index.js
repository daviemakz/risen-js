'use strict';

import 'regenerator-runtime';

// Load Templates
import ResponseBodyObject from '../template/response';

// Get a unique array
export function uniqueArray(arrArg) {
  return arrArg.filter((elem, pos, arr) => arr.indexOf(elem) === pos);
}

// Get a random list of elements from array
export function getRandomElements(arr, count) {
  const arrClone = [...arr];
  return [...Array(count)].map(
    () => arrClone.splice(Math.floor(Math.random() * arrClone.length), 1)[0]
  );
}

// Start service instance wrapper
export function startService(serviceInfo, instances) {
  return this.startServices(serviceInfo, instances);
}

// Stop service instance wrapper
export function stopService(name, instances) {
  return new Promise((resolve, reject) => {
    // Get highest number of instances which can be shutdown
    const requestedInstances = Math.abs(instances);
    const actualInstances = this.serviceData[name].port.length;
    const instancesToTerminate =
      requestedInstances > actualInstances
        ? actualInstances
        : requestedInstances;
    // If instance count is 0 then just resolve
    if (instancesToTerminate === 0) {
      return resolve(void 0);
    }
    // Get ports to close
    const ports = getRandomElements(
      this.serviceData[name].port,
      instancesToTerminate
    );
    // Assign ports which are being shutdown
    process.env.exitedProcessPorts = uniqueArray(
      [].concat(process.env.exitedProcessPorts, ports)
    );
    (typeof process.env.exitedProcessPorts === 'string'
      ? process.env.exitedProcessPorts.split(',')
      : process.env.exitedProcessPorts
    )
      .map((port) => parseInt(port, 10))
      .filter((exitedPort) => typeof exitedPort === 'number');
    // Process indexes
    const processIndexes = ports.map((port) =>
      this.getProcessIndex(name, port)
    );
    // Process exiter
    try {
      processIndexes.forEach(
        async (index, elIndex) =>
          new Promise((resolve, reject) => {
            // Show message
            this.log(
              `Service core will send kill command to the service: ${name}/port:${ports[elIndex]}`,
              'log'
            );
            // Send kill process message
            this.serviceData[name].socket[index].request(
              'SERVICE_KILL',
              void 0,
              (res) => {
                this.log(
                  `Service core has recieved acknowledgement of kill command from: ${name}/port:${ports[elIndex]}`,
                  'log'
                );
                if (res.status.command.code === 100) {
                  resolve(true);
                } else {
                  reject(Error(false));
                }
              }
            );
          })
      );
      // Resolve
      return resolve(void 0);
    } catch (e) {
      return reject(e);
    }
  });
}

// End the framework, turn it off
export function end(socket) {
  // Invoke Template(s)
  const resObject = new ResponseBodyObject();
  // Build Response Object [status - transport]
  resObject.status.transport.responseSource = process.env.name;
  // Set base options
  const baseResponse = {
    error: null,
    details: {}
  };
  // Assign message
  resObject.resultBody.resData = Object.assign(baseResponse, {
    status: true,
    message: 'Shutting down micro service framework.',
    details: {}
  });
  // Respond To Source
  socket.reply(resObject);
  // Kill process
  return setTimeout(() => process.exit(), 1000);
}

// Store persistent data
export function storage(socket, data) {
  // Invoke Template(s)
  const resObject = new ResponseBodyObject();
  // Build Response Object [status - transport]
  resObject.status.transport.responseSource = process.env.name;
  // Perform operations
  return setImmediate(() =>
    this.databaseOperation(
      data.body.table,
      data.body.method,
      data.body.args,
      (status, result, error) => {
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
      }
    )
  );
}

// Change the number of running instances
export async function changeInstances(socket, data) {
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
  } else if (
    typeof data.body.instances !== 'number' ||
    data.body.instances === 0
  ) {
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
        ? await startService.call(
            this,
            { [data.body.name]: this.serviceInfo[data.body.name] },
            data.body.instances
          )
        : await stopService.call(this, data.body.name, data.body.instances);
    // Get next ports
    const nextPorts = this.serviceData[data.body.name].port;
    // Assign response object
    if (typeof result === 'undefined') {
      resObject.resultBody.resData = Object.assign(baseResponse, {
        status: true,
        message: 'Services were modified successfully!',
        details: {
          name: data.body.name,
          previousPorts,
          nextPorts
        }
      });
    } else {
      resObject.resultBody.errData = Object.assign(baseResponse, {
        status: false,
        message: 'Services modification failed!',
        details: {
          name: data.body.name,
          previousPorts,
          nextPorts
        }
      });
    }
  }
  // Respond To Source
  return socket.reply(resObject);
}

// Export functions to be consumed
export default {
  end,
  storage,
  changeInstances,
  uniqueArray,
  getRandomElements
};
