'use strict';

// Import system components
import Db from '../../../dist/lib/db';

// Test suite
describe('dist/lib/db', () => {
  test('to match snapshot', () => {
    expect(new Db({ databaseName: 'exampleTable' })).toMatchSnapshot();
  });
});
