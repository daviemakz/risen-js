'use strict';

module.exports = {
  multiplyArrayElements({ data, sendSuccess }) {
    const listOfNumbers = data.body;
    const firstNumber = listOfNumbers.shift();
    return sendSuccess({
      result: listOfNumbers.reduce(
        (total, number) => total * number,
        firstNumber
      )
    });
  },
  divideArrayElements({ data, sendSuccess }) {
    const listOfNumbers = data.body;
    const firstNumber = listOfNumbers.shift();
    return sendSuccess({
      result: listOfNumbers.reduce(
        (total, number) => total / number,
        firstNumber
      )
    });
  },
  addArrayElements({ data, sendSuccess }) {
    const listOfNumbers = data.body;
    const firstNumber = listOfNumbers.shift();
    return sendSuccess({
      result: listOfNumbers.reduce(
        (total, number) => total + number,
        firstNumber
      )
    });
  },
  subtractArrayElements({ data, sendSuccess }) {
    const listOfNumbers = data.body;
    const firstNumber = listOfNumbers.shift();
    return sendSuccess({
      result: listOfNumbers.reduce(
        (total, number) => total - number,
        firstNumber
      )
    });
  }
};
