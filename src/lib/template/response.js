'use strict';

export default () => ({
  status: {
    transport: {
      code: 2000,
      message: 'Transport completed successfully',
      responseSource: ''
    },
    command: {
      code: 500,
      message: 'Command completed successfully'
    }
  },
  resultBody: {
    resData: null,
    errData: null
  }
});
