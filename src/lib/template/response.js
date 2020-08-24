'use strict';

export default () => ({
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
});
