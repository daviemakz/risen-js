'use strict';

// Import system components
import Core, { uniqueArray, getRandomElements } from './../../../dist/lib/core';

// Test suite
describe('dist/lib/db', () => {
  describe('uniqueArray()', () => {
    test('to match snapshot', () => {
      expect(uniqueArray([1, 1, 1, 2, 3, 4, 5])).toMatchSnapshot();
    });
  });
  describe('getRandomElements()', () => {
    test('to match snapshot', () => {
      expect(
        Array.isArray(getRandomElements([1, 1, 1, 2, 3, 4, 5], 2))
      ).toMatchSnapshot();
    });
  });
  describe('EXPORTS: Core', () => {
    test('to match snapshot', () => {
      expect(Core).toMatchSnapshot();
    });
  });
});
