'use strict';

// Response Body Template
module.exports = function() {
  return {
    status: {
      transport: {
        code: 1000,
        message: 'transport Completed Successfully',
        responseSource: '',
      },
      command: {
        code: 100,
        message: 'command Completed Successfully',
      },
    },
    resultBody: {
      ResData: {},
      ErrData: {},
    },
  };
};
