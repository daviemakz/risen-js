'use strict';

// Import system components
import CommandTemplate from '../../src/lib/template/command';
import ResponseTemplate from '../../src/lib/template/response';

describe('src/lib/validate', () => {
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
