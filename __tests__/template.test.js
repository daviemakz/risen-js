'use strict';

// Import system components
import CommandTemplate from '../tmp/lib/template/command';
import ResponseTemplate from '../tmp/lib/template/response';

describe('tmp/lib/validate', () => {
  describe('CommandTemplate()', () => {
    describe('setCommandSource()', () => {
      let commandBody;
      beforeEach(() => {
        commandBody = new CommandTemplate();
      });
      test('can set a response source', () => {
        const value = {
          name: 'exampleService',
          pid: 224233,
          address: 'localhost:1024',
          instanceId: 'EDEAB7B2-06D8-4BB9-A373-ED10B1656F3D'
        };
        commandBody.setCommandSource(value);
        expect(commandBody.source).toEqual(value);
      });
    });

    describe('setDestination()', () => {
      let commandBody;
      beforeEach(() => {
        commandBody = new CommandTemplate();
      });
      test('can set a destination', () => {
        const value = 'devServer';
        commandBody.setDestination(value);
        expect(commandBody.destination).toEqual(value);
      });

      test('throws an error if its not a string', () => {
        expect(() => {
          commandBody.setDestination(12345);
        }).toThrow();
      });
    });

    describe('setFuncName()', () => {
      let commandBody;
      beforeEach(() => {
        commandBody = new CommandTemplate();
      });
      test('can set a function name', () => {
        const value = 'calculateNumber';
        commandBody.setFuncName(value);
        expect(commandBody.functionName).toEqual(value);
      });

      test('throws an error if its not a string', () => {
        expect(() => {
          commandBody.setFuncName(12345);
        }).toThrow();
      });
    });

    describe('setBody()', () => {
      let commandBody;
      beforeEach(() => {
        commandBody = new CommandTemplate();
      });
      test('can set a body', () => {
        const value = { value: 12345 };
        commandBody.setBody(value);
        expect(commandBody.body).toStrictEqual(value);
      });
    });
  });

  describe('ResponseTemplate()', () => {
    describe('setResponseSource()', () => {
      let responseBody;
      beforeEach(() => {
        responseBody = new ResponseTemplate();
      });
      test('can set a response source', () => {
        const value = {
          name: 'exampleService',
          pid: 224233,
          instanceId: 'EDEAB7B2-06D8-4BB9-A373-ED10B1656F3D',
          address: 'localhost:1024'
        };
        responseBody.setResponseSource(value);
        expect(responseBody.status.transport.responseSource).toEqual(value);
      });
    });

    describe('setCommandStatus()', () => {
      let responseBody;
      beforeEach(() => {
        responseBody = new ResponseTemplate();
      });
      test('can set a command status', () => {
        const value = {
          code: 200,
          message: 'Command completed successfully'
        };
        responseBody.setCommandStatus(value);
        expect(responseBody.status.command).toEqual(value);
      });
    });

    describe('setTransportStatus()', () => {
      let responseBody;
      beforeEach(() => {
        responseBody = new ResponseTemplate();
      });
      test('can set a transport status', () => {
        const value = {
          code: 2000,
          message: 'Transport was successful!'
        };
        responseBody.setTransportStatus(value);
        expect(responseBody.status.transport).toEqual(value);
      });
    });

    describe('setResData()', () => {
      let responseBody;
      beforeEach(() => {
        responseBody = new ResponseTemplate();
      });
      test('can set response data', () => {
        const value = {
          result: 1
        };
        responseBody.setResData(value);
        expect(responseBody.resultBody.resData).toEqual(value);
      });
    });

    describe('setErrData()', () => {
      let responseBody;
      beforeEach(() => {
        responseBody = new ResponseTemplate();
      });
      test('can set error data', () => {
        const value = {
          result: 1
        };
        responseBody.setErrData(value);
        expect(responseBody.resultBody.errData).toEqual(value);
      });
    });

    describe('success()', () => {
      let responseBody;
      beforeEach(() => {
        responseBody = new ResponseTemplate();
      });
      test('can set success state', () => {
        const data = {
          result: 1
        };
        responseBody.success({ data });
        expect(responseBody.status.command).toEqual({
          code: 200,
          message: 'Command completed successfully'
        });
        expect(responseBody.resultBody.resData).toEqual(data);
      });
    });

    describe('error()', () => {
      let responseBody;
      beforeEach(() => {
        responseBody = new ResponseTemplate();
      });
      test('can set error state', () => {
        const data = {
          result: 10
        };
        responseBody.error({ data });
        expect(responseBody.status.command).toEqual({
          code: 400,
          message:
            'Command executed but an error occurred while processing the request'
        });
        expect(responseBody.resultBody.errData).toEqual(data);
      });
    });
  });
});
