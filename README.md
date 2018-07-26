
# <img src="kiwi.png" width="120" alt="logo">
Framework to help rest api development using typescript and node.

# Table of Contents
* [Installation](#installation)
* [Sample](#sample)
* [Middleware](#middlewares)
* [Authorization](#authorization)
* [Cors](#cors)
* [Documentation](#documentation)
  
## Installation
1. Install module:
    `npm install kiwi-server --save`
    
2. You need to have these options in tsconfig.json file of your project:
    ```javascript
    {
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true
    }
    ```

## Sample
1. Create your first controller class `TestController.ts`
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
   
    We can use QueryParams to get an object with tha key values that we send on the url.
    For example if you send something like that http://*******/testcontroller/queryparam/1?name=guille&lastname=fernandez you will recevie a json like beloow

    ```javascript
    @Get('/queryparam/:id')
    public queryparam(@QueryParam() object: any, @Param('id') id: string){
        return object;
    }
    ```

    ```javascript
    {
        "name": "guille",
        "lastname": "fernandez"
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
1. You can create middlewares to execute activities before and and after the execution of an action.
For example to enable cors we use a specific middleware that is in charge to add the http headers for that.
Its important to execute next if you want that the flow continue executing. In other case the flow finish and you must do something with the response, if you dont do anything the client never gets a response.
Below is a sample that execute before any action.
Also you can add the order that you want to execute your middlewares like the sample bellow.
	```javascript
	import { IMiddleware } from 'kiwi-server';
	import { MiddlewareBefore } from 'kiwi-server';
	import * as http from 'http';
	@MiddlewareBefore(7)
	export class TestMiddleware implements IMiddleware{
		execute(request: http.IncomingMessage, response: http.ServerResponse, next: any){
			response.setHeader( 'Authorization', 'hola' );
			console.log('TestMiddleware execute');
			next();
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
1. You can enable cross domain by configuration
    
    ```javascript
    import { createKiwiServer } from 'kiwi-server';
    import { TestController } from './test-controller';
    import { TestController2 } from './test-controller2';

    const options = {
        controllers: [TestController, TestController2],
        cors: true
    }
    const server = createKiwiServer(options);
    server.listen(8086);
    ```

## Documentation
1. You can enable cross domain by configuration
    
    ```javascript
    import { createKiwiServer } from 'kiwi-server';
    import { TestController } from './test-controller';
    import { TestController2 } from './test-controller2';

    const options = {
        controllers: [TestController, TestController2],
        cors: true,
        documentation: {
            enabled: true,
            path: '/apidoc'
        }
    }
    const server = createKiwiServer(options);
    server.listen(8086);
    ```
