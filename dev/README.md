# Summary

This file is to allow you to develop and live reload the application while making changes. You can add any services you want to test if you are adding a new feature. You can see the output in the terminal so you can check if you have made any breaking changes.

# Processes

## Microservices:

`devService` - Returns a plain string and a few other operations.
`numbersService` - Allows some operations on an array of numbers.
`storageService` - Saves the previous and current integer passed to it and returns the result.
`instanceService` - Has more than one instance running and returns its instance ID.
`runOnStartService` - Allows us to test run on start functionality of the framework.

## Express Servers:

`Express Server 1` - HTTPS (Port: 12000)
`Express Server 2` - HTTP (Port: 12001)

# Tests:

## communication.test.js

1. Response from the "devService" from a client HTTPS request via Express server 1. (callback)
   a) Append a header via the pre middleware.
   b) Append a header via the post middleware.
   c) Append a header via the middleware.
2. Response from the "devService" from a client HTTPS request via Express server 1. (promise)
3. Response from the "devService" from a client HTTP request via Express server 2. (promise)
4. Response from the "devService" via a direct connection to the framework.
   a) Use the client version of Risen.JS.
5. Response from the "devService" which speaks to the "numbersService" before responding from a client HTTP request. (promise)
6. Response from two services using the requestChain method.
   a) Test generating command(s).
   b) Test generating body.
7. Append a header to all requests via httpOptions.middleware.

## public.test.js

1. Response from the "Express Server 1" returning a JSON in the public path of the framework.
2. Response from the "Express Server 2" returning a JSON in the public path of the framework.

## core.test.js

1. Test all service core inbuilt functions.
2. Response from the "storageService" which checks that storage is working via an HTTP request.
3. Response from the "instanceService" which checks that multiple instances are indeed running via an HTTP request.
4. Test a custom service core function.
5. Check that "runOnStart" works with the service core.
6. Check that "runOnStart" works with a microservice.

## persistence.test.js

1. Test logging to file works.
2. Test the existence of the SQLite file exists.

## errors.test.js

1. Test redirect failed on a microservice function that doesn't exist.
2. Test redirect failed on service core for a core function.
3. Test redirect failed on a service that doesn't exist.

## template.test.js

1. Test CommandBody() functions.
2. Test ResponseBody() functions.

## validate.test.js

1. Test validateRouteOptions() function works.
2. Test validateHttpOptions() function works.
3. Test validateCoreOperations() function works.
4. Test validateOptions() function works.
5. Test validateServiceOptions() function works.
