'use strict';

// Response Body Template
module.exports = function() {
  return {
    status: {
      transport: {
        code: 1000,
        message: 'Transport completed successfully',
        responseSource: ''
      },
      command: {
        code: 100,
        message: 'Command completed successfully'
      }
    },
    resultBody: {
      resData: {},
      errData: {}
    }
  };
};
