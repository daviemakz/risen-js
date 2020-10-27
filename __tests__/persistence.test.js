'use strict';

import fs from 'fs';

const sqlLite = 'json.sqlite';

// Test suite
describe('sql lite (quick.db)', () => {
  test('db file exists', () => {
    return new Promise((resolve, reject) => {
      fs.access(sqlLite, fs.constants.F_OK, (err) => {
        return err ? reject(Error(err)) : resolve(true);
      });
    });
  });

  test('db file has contents', () => {
    return new Promise((resolve, reject) => {
      fs.readFile(sqlLite, 'utf8', (err, data) => {
        if (err || !data.length) {
          return reject(Error(err));
        }
        return resolve(true);
      });
    });
  });
});

// describe('logging', () => {
//   test('log file exists', () => {
//     return new Promise((resolve, reject) => {
//       fs.access(logFile, fs.constants.F_OK, (err) => {
//         return err ? reject(Error(err)) : resolve(true);
//       });
//     });
//   });
//
//   test('log file has contents', () => {
//     return new Promise((resolve, reject) => {
//       fs.readFile(logFile, 'utf8', (err, data) => {
//         if (err || !data.length) {
//           return reject(Error(err));
//         }
//         return resolve(true);
//       });
//     });
//   });
// });
