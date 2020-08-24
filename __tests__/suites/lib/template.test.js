'use strict';

// Import system components
import CommandTemplate from '../../../dist/lib/template/command';
import ResponseTemplate from '../../../dist/lib/template/response';

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
