'use strict';

module.exports = {
  getStandardResponse({ sendSuccess }) {
    return sendSuccess({
      result: 'Service to service communication verified!'
    });
  },
  getNumberFifty({ sendSuccess }) {
    return sendSuccess({ result: 50 });
  },
  getNumberOneHundred({ sendSuccess }) {
    return sendSuccess({ result: 100 });
  },
  performCalculation({ data, sendSuccess, sendError, request }) {
    const { numberList, calculationMethod } = data.body;
    return request(
      {
        body: numberList,
        functionName: calculationMethod, // multiplyArrayElements | divideArrayElements | addArrayElements | subtractArrayElements
        destination: 'numbersService'
      },
      (data) =>
        data.status
          ? sendSuccess({ result: data.response })
          : sendError({ result: data.response })
    );
  }
};
