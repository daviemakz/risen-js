'use strict';

module.exports = {
  storePowerNumber({ data, sendSuccess, sendError, request }) {
    // Get power ^ 2 of number
    const number = data.body;
    const poweredNumber = number ** 2;
    // Save this in the service core
    return request(
      {
        destination: 'serviceCore',
        functionName: 'storage',
        body: {
          method: 'set',
          table: '_defaultDatabase',
          args: [`powerOfNumber-${number}`, poweredNumber]
        }
      },
      (data) => {
        if (data.status) {
          return sendSuccess({
            result: true
          });
        }
        return sendError({
          result: false,
          ...data.command
        });
      }
    );
  }
};
