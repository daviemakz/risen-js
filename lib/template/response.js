'use strict';

// Response Body Template
module.exports = function() {
  return {
    Status: {
      Transport: {
        Code: 1000,
        Message: 'Transport Completed Successfully',
        ResponseSource: '',
      },
      Command: {
        Code: 100,
        Message: 'Command Completed Successfully',
      },
    },
    ResultBody: {
      ResData: {},
      ErrData: {},
    },
  };
};
