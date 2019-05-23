'use strict';

// Import system components
import CommandTemplate from './../../../dist/lib/template/command.js';
import ResponseTemplate from './../../../dist/lib/template/response.js';

describe('dist/lib/validate', () => {
  describe('CommandTemplate()', () => {
    test('to match snapshot', () => {
      expect(CommandTemplate()).toMatchSnapshot();
    });
  });
  describe('ResponseTemplate()', () => {
    test('to match snapshot', () => {
      expect(ResponseTemplate()).toMatchSnapshot();
    });
  });
});
