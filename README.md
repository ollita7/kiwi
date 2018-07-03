# KIWI Server
Its a simple node server to create rest services.

# Table of Contents
* [Installation](#installation)
* [Sample](#sample)
* [Middleware](#middlewares)
* [Authorization](#authorization)
* [Cors](#cors)
  
## Installation
1. Install module:
    `npm install kiwi-server --save`

## Sample
1. Create your firs controller class `TestController.ts`
    ```javascript
    import { Get, Post, JsonController, Param, Body } from 'kiwi-server';

    @JsonController('/testcontroller')
    export class TestController {

        @Get('/getAction/:id/:id2/:id3')
        public get(@Param('id') id: string, @Param('id2') id2: string, @Param('id3') id3: string) {
            return {method: "get test"};
        }

        @Post('/postAction/:id')
        public post( @Body() request: any, @Param('id') id: string) {
            return {
                method: "post test",
                request: request
            };
        }
    }
    ```
    You need to have these options in tsconfig.json file of your project:
    ```javascript
    {
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true
    }
    ```
 
 2. After you create the controller you must create the server that use that controller.
    ```javascript
    import { createKiwiServer } from 'kiwi-server';
    import { TestController } from './test-controller';

    const options = {
        controllers: [TestController],
    }
    const server = createKiwiServer(options);
    server.listen(8086);
    ```
## Middlewares
1. You can create middleware to execute activities before and and after the execution of an action.
For example to enable cors we use a specific middleware that is in charge to add the http headers for that.
Below is a sample that execute before any action.
	```javascript
	import { IMiddleware } from '../src/middlewares/middleware';
	import { MiddlewareBefore } from '../src/decorators/middlewareBefore';
	import * as http from 'http';
	@MiddlewareBefore()
	export class TestMiddleware implements IMiddleware{
		execute(request: http.IncomingMessage, response: http.ServerResponse){
			response.setHeader( 'Authorization', 'hola' );
			console.log('TestMiddleware execute');
			return;
		}
	}
	```

## Authorization
 1. You have to specify on controller what actions need to be authorized. To do that you have a decorator @Authorization.
 In the sample you can see that we only need authorization to postAction. Also yo can put the authorization in the controller so all the actions must me authorized.
 
    ```javascript
    import { Get, Post, JsonController, Authorize } from 'kiwi-server';

    @JsonController('/testcontroller2')
    export class TestController2 {
        @Get('/getAction')
        public get(){
            return "get test2";
        }

        @Authorize(['ADMIN', 'USER'])
        @Post('/postAction')
        public post(@Body() request: any) {
            return {
                method: "post test2",
                request: request
            };
        }
    }
    ```

2. On the server you must define the function that is going to be executed everytime that an action or a controller has the @Authorization decorator. If that function return false the service is going to return 401 http error, in other case it will contnue the normal execution path.

    ```javascript
    import { createKiwiServer } from 'kiwi-server';
    import { TestController } from './test-controller';
    import { TestController2 } from './test-controller2';

    function validateAuthentication(roles: Array<string>){
        console.log(roles);
        return false;
    }

    const options = {
        controllers: [TestController, TestController2],
        authorization: validateAuthentication
    }
    const server = createKiwiServer(options);
    server.listen(8086);
    ```

## Cors
You can enable cross domain by configuration
	
```javascript
	import { createKiwiServer } from 'kiwi-server';
	import { TestController } from './test-controller';
	import { TestController2 } from './test-controller2';

	function validateAuthentication(roles: Array<string>){
		console.log(roles);
		return false;
	}

	const options = {
		controllers: [TestController, TestController2],
		authorization: validateAuthentication,
		cors: true
	}
	const server = createKiwiServer(options);
	server.listen(8086);
```
