'use strict';

import 'regenerator-runtime';

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
            this.serviceData[name].clientSocket[index].request(
              'SERVICE_KILL',
              void 0,
              (res) => {
                this.log(
                  `Service core has recieved acknowledgement of kill command from: ${name}/port:${ports[elIndex]}`,
                  'log'
                );
                if (res.status.command.code === 200) {
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
export function end({ sendSuccess }) {
  // Set the success
  sendSuccess({
    result: {
      error: null,
      details: {},
      isSuccess: true,
      message: 'Shutting down micro service framework.'
    }
  });
  // Kill process
  return setTimeout(() => process.exit(), 1000);
}

// Store persistent data
export function storage({ data, sendError, sendSuccess }) {
  const { table, method, args } = data.body;
  return setImmediate(() =>
    this.databaseOperation(table, method, args, (isSuccess, result, error) => {
      // Assign function result
      if (isSuccess) {
        return sendSuccess({
          result: {
            isSuccess,
            result,
            message: 'The operation completed successfully!'
          }
        });
      }
      return sendError({
        result: {
          isSuccess,
          result,
          error,
          message: 'The operation failed!'
        },
        code: 401,
        message:
          'Command executed but an error occurred while attempting storage operation.'
      });
    })
  );
}

// Change the number of running instances
export async function changeInstances({ data, sendError, sendSuccess }) {
  const { name, instances } = data.body;
  const baseResponse = {
    error: null,
    details: {}
  };

  // Check if the service has already been defined
  if (!Object.keys(this.serviceInfo).includes(name)) {
    sendError({
      result: Object.assign(baseResponse, {
        isSuccess: false,
        message: `Service "${name}" was not found!`
      })
    });
  } else if (typeof instances !== 'number' || instances === 0) {
    sendError({
      result: Object.assign(baseResponse, {
        isSuccess: false,
        message: '"instance" property must be a number which is not 0!'
      })
    });
  } else {
    // Base response object
    const previousPorts = [].concat(...this.serviceData[name].port);

    // Get result
    const result =
      instances > 0
        ? await startService.call(
            this,
            { [name]: this.serviceInfo[name] },
            instances
          )
        : await stopService.call(this, name, instances);

    // Get next ports
    const nextPorts = this.serviceData[name].port;

    // Assign response object
    if (typeof result === 'undefined') {
      sendSuccess({
        result: Object.assign(baseResponse, {
          isSuccess: true,
          message: 'Services were modified successfully!',
          details: {
            instances: nextPorts.length,
            name,
            previousPorts,
            nextPorts
          }
        })
      });
    } else {
      sendError({
        result: Object.assign(baseResponse, {
          isSuccess: false,
          message: 'Services modification failed!',
          details: {
            instances: nextPorts.length,
            name,
            previousPorts,
            nextPorts
          }
        }),
        code: 402,
        message:
          'Command executed but an error occurred while attempting to change instances'
      });
    }
  }
}

// Export request functions
export * from './request';

// Export functions to be consumed
export default {
  end,
  storage,
  changeInstances,
  uniqueArray,
  getRandomElements
};
