'use strict';

module.exports = {
  initialiseData() {
    this.localStorage.key = 'management';
  },
  getLocalStorage({ sendSuccess }) {
    return sendSuccess({
      result: this.localStorage
    });
  }
};
