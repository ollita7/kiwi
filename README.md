
# <img src="kiwi.png" width="120" alt="logo">
Framework to help building a REST API using typescript and node.

[![Build Status](https://travis-ci.com/ollita7/kiwi.svg?branch=master)](https://travis-ci.com/ollita7/kiwi) [![Coverage Status](https://coveralls.io/repos/github/ollita7/kiwi/badge.svg?branch=master)](https://coveralls.io/github/ollita7/kiwi?branch=master)
# Table of Contents
* [Installation](#installation)
* [Sample](#sample)
* [Middleware](#middlewares)
* [Authorization](#authorization)
* [Cors](#cors)
* [Prefix](#prefix)
* [Dependency Injection](#dependency-injection)
* [Sockets](#sockets)
* [Documentation](#documentation)
  
## Installation
1. Install module:
    `npm install kiwi-server --save`
    
    `npm install kiwi-server-cli -g`
    
    Optional: https://github.com/ollita7/kiwi-cli
    
2. Add these options to the `tsconfig.json` file of your project:
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
            return { method: "get test" };
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
   
    We can use QueryParams to get an object with the keys and values that we send on the url.

    For example if you send something like http://.../testcontroller/queryparam/1?name=guille&lastname=fernandez you will receive an object like below:

    ```javascript
    @Get('/queryparam/:id')
    public queryparam(@QueryParam() object: any, @Param('id') id: string) {
        return object;
    }
    ```

    ```javascript
    {
        "name": "guille",
        "lastname": "fernandez"
    }
    ```

    We can use HeaderParams to get http headers.
    In the next example we are going to receive the token HTTP header if it exists.
    
    ```javascript
    @Get('/queryparam/:id')
    public queryparam(@Param('id') id: string, @HeaderParam('token') token: string) {
        return object;
    }
    ```
 
 2. After creating the controller, create the server that uses that controller.
    ```javascript
    import { createKiwiServer } from 'kiwi-server';
    import { TestController } from './test-controller';

    const options = {
        controllers: [TestController],
    };
    const server = createKiwiServer(options);
    server.listen(8086);
    ```
## Middlewares
1. You can create middlewares to execute activities before and after the execution of an action.

  For example to enable CORS we use a specific middleware that is in charge of adding the HTTP headers for that.
  It's important to execute `next` if you want the flow to continue executing. Otherwise the flow finishes and you must do something with the response, if you don't the client never gets a response.
  Below is an example that executes before any action.

  Also you can add the order that you want to execute your middlewares:  
    ```javascript
	import { IMiddleware } from 'kiwi-server';
	import { MiddlewareBefore } from 'kiwi-server';
	import * as http from 'http';

	@MiddlewareBefore(7)
	export class TestMiddleware implements IMiddleware {
		execute(request: http.IncomingMessage, response: http.ServerResponse, next: any) {
			response.setHeader( 'Authorization', 'hola' );
			console.log('TestMiddleware execute');
			next();
		}
	}
    ```

## Authorization
 1. On the controller specify what actions need to be authorized, using the `@Authorize` decorator.
 In the following example we only need to authorize the `post` action. You can also put the decorator in the controller if all the actions need to be authorized.
 
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

2. On the server define the function that is going to be executed everytime an action or a controller has the `@Authorize` decorator. If that function returns `false` the service is going to return 401 HTTP error, in other case it will continue the normal execution path.

    ```javascript
    import { createKiwiServer } from 'kiwi-server';
    import { TestController } from './test-controller';
    import { TestController2 } from './test-controller2';

    async function validateAuthentication(request: http.IncomingMessage, roles: Array<string>): Promise<AuthorizeResponse | boolean> {
        console.log(roles);
        return new AuthorizeResponse(403, 'custom message');
        // return true if want to continue execution
    }

    const options = {
        controllers: [TestController, TestController2],
        authorization: validateAuthentication
    }
    const server = createKiwiServer(options);
    server.listen(8086);
    ```

## CORS
1. You can enable cross domain by configuration
    
    ```javascript
    import { createKiwiServer } from 'kiwi-server';
    import { TestController } from './test-controller';
    import { TestController2 } from './test-controller2';

    const options = {
        controllers: [TestController, TestController2],
        cors: {
            enabled: true,
            domains: ['domain1.com', 'domain2.com']
        }
    }
    const server = createKiwiServer(options);
    server.listen(8086);
    ```

## Prefix
1. You can add a prefix for all the URLs. In the following example, all the URLs will have the `v1/` prefix:
    
    ```javascript
    import { createKiwiServer } from 'kiwi-server';
    import { TestController } from './test-controller';
    import { TestController2 } from './test-controller2';

    const options = {
        controllers: [TestController, TestController2],
        prefix: 'v1/'
    }
    const server = createKiwiServer(options);
    server.listen(8086);
    ```


## Dependency Injection
1. You can use dependency injection in your controllers, by adding arguments to the constructor.
Then you can use that in any method that you want.

    ```javascript
    import { Get, Post, JsonController, Param, Body, QueryParam, Authorize } from 'kiwi-server';
    import { Utils } from './utils';

    @Authorize(['role1, role2'])
    @JsonController('/testcontroller')
    export class TestController {
        
        constructor(private utils: Utils) {}
        
        @Post('/meetupjs')
        public test23(@Body() body: any) {
            return body;
        }

        @Get('/queryparam/:id')
        public queryparam(@QueryParam() object: any, @Param('id') id: string) {
            this.utils.print();
            return object;
        }
    ```
## Sockets
1. socket.io is integrated to our framework. Enable socket support by adding the `socket` property to the options.

    ```javascript
    const options = {
        controllers: [TestController, TestController2],
        documentation: {
            enabled: true,
            path: '/apidoc'
        },
        socket: true
    }

    const server = createKiwiServer(options, socketInit);

    function socketInit() {
        const io = getSocket();
        io.on('connection', (socket: any) => {
            socket.userId  = socket.handshake.query.user;
        });
    }
    ```
    Finally use `getSocket` in any place of the application and start using it.

## Documentation
1. Enable automatic swagger documentation, setting the path where it will be accessible.
    
    ```javascript
    import { createKiwiServer } from 'kiwi-server';
    import { TestController } from './test-controller';
    import { TestController2 } from './test-controller2';

    const options = {
        controllers: [TestController, TestController2],
        prefix: 'v1/',
        cors: true,
        documentation: {
            enabled: true,
            path: '/apidoc'
        }
    }
    const server = createKiwiServer(options);
    server.listen(8086);
    ```
2. Decorate your models
    ```javascript
    import { IsArray, IsInt, IsDate, IsOptional } from 'kiwi-server';

    export class TimesheetEntry {
      @IsInt() projectId: number;
      @IsDate() date: Date;
      @IsOptional() @IsInt() hours?: number;
    }

    export class TimesheetEntries {
      @IsArray(() => TimesheetEntry)
      entries: TimesheetEntry[];
    }
    ```
3. Visit the documentation page, in this example it would be at http://localhost:8086/v1/apidoc
