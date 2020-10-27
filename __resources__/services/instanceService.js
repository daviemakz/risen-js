'use strict';

module.exports = {
  respond({ sendSuccess }) {
    return sendSuccess({
      result: true
    });
  }
};
