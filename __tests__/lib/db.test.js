'use strict';

// Import system components
import Db from '../../src/lib/db';

// Test suite
describe('src/lib/db', () => {
  test('to match snapshot', () => {
    expect(new Db({ databaseName: 'exampleTable' })).toMatchSnapshot();
  });
});
