
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
1. Create your first controller class `user-controller.ts`
    ```javascript
    import { Get, Post, Put, JsonController, Param, Body, QueryParam, Authorize, HeaderParam, Delete } from '../../../src/index';
    import { UserModel } from '../../models/models';
    import { isNil } from 'lodash';
    import { Utils } from '../../utils';

    @JsonController('/user')
    export class UserController {
        constructor() {}

        @Authorize(['Admin'])
        @Post('/create')
        public create(@Body() user: UserModel) {
            user.id = Utils.userList.length + 1;
            Utils.userList.push(user);
            return user;
        }

        @Authorize(['Admin'])
        @Get('/get/:id')
        public getById(@Param('id') id: number) {
            var user = Utils.userList.filter(function(obj) {
            return obj.id === id;
            });

            return user;
        }

        @Authorize(['Admin'])
        @Put('/update')
        public update(@Body() user: UserModel) {
            let userAux = Utils.userList.find(x => x.id == user.id);
            let index = Utils.userList.indexOf(userAux);
            Utils.userList[index] = user;
            return true;
        }

        @Authorize(['Admin'])
        @Delete('/delete/:id')
        public delete(@Param('id') id: number) {
            Utils.userList = Utils.userList.filter(function(obj) {
            return obj.id !== id;
            });
            return true;
        }
    }
    ```
   
    We can use QueryParams to get an object with the keys and values that we send on the url.

    For example if you send something like http://.../testcontroller/queryparam/1?name=guille&lastname=fernandez you will receive an object like below:

    ```javascript
        @Get('/listFilter')
        public listFilter(@QueryParam() params: any) {
            if (!isNil(params)) {
            var users = Utils.userList.filter(function(obj) {
                return obj.name === params.name && obj.age === +params.age;
            });
            }
            return users;
        }
    ```

    ```javascript
    {
        "name": "guille",
        "age": 33
    }
    ```

    We can use HeaderParams to get http headers.
    In the next example we are going to receive the token HTTP header if it exists.
    
    ```javascript
    @Get('/search/:name')
    public queryparam(@Param('name') name: string, @HeaderParam('token') token: string) {
        this.aux.print(token);
        if (!isNil(name)) {
        var users = Utils.userList.filter(function(obj) {
            return obj.name === name;
        });
        }
        return users;
    }
    ```
 
 2. After creating the controller, create the server that uses that controller.
    ```javascript
    import { createKiwiServer } from 'kiwi-server';
    import { UserController } from './controllers/user/user-controller';

    const options = {
        controllers: [UserController],
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
    import { IMiddleware } from '../../src/middlewares/middleware';
    import { MiddlewareAfter } from '../../src/decorators/middlewareAfter';
    import * as http from 'http';

    @MiddlewareAfter(1)
    export class UserMiddleware implements IMiddleware{

        execute(request: http.IncomingMessage, response: http.ServerResponse, next: any){
            response.setHeader( 'Authorization', 'token' );
            console.log('UserMiddleware execute');
            next();
        }
    }
    ```

## Authorization
 1. On the controller specify what actions need to be authorized, using the `@Authorize` decorator.
 In the following example we only need to authorize the `put` action. You can also put the decorator in the controller if all the actions need to be authorized.
 
    ```javascript
    @Get('/list')
    public listAll() {
        return Utils.userList;
    }
    
    @Authorize(['Admin'])
    @Put('/update')
    public update(@Body() user: UserModel) {
        let userAux = Utils.userList.find(x => x.id == user.id);
        let index = Utils.userList.indexOf(userAux);
        Utils.userList[index] = user;
        return true;
    }

    ```

2. On the server define the function that is going to be executed everytime an action or a controller has the `@Authorize` decorator. If that function returns `false` the service is going to return 401 HTTP error, in other case it will continue the normal execution path.

    ```javascript
    import { createKiwiServer } from 'kiwi-server';
    import { UserController } from './controllers/user/user-controller';

    async function validateAuthentication(request: http.IncomingMessage, roles: Array<string>): Promise<AuthorizeResponse | boolean> {
        console.log(roles);
        return new AuthorizeResponse(403, 'custom message');
        // return true if want to continue execution
    }

    const options = {
        controllers: [UserController],
        authorization: validateAuthentication
    }
    const server = createKiwiServer(options);
    server.listen(8086);
    ```

## CORS
1. You can enable cross domain by configuration
    
    ```javascript
    import { createKiwiServer } from 'kiwi-server';
    import { UserController } from './controllers/user/user-controller';

    const options = {
        controllers: [UserController],
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
    import { UserController } from './controllers/user/user-controller';

    const options = {
        controllers: [UserController],
        prefix: 'v1/'
    }
    const server = createKiwiServer(options);
    server.listen(8086);
    ```


## Dependency Injection
1. You can use dependency injection in your controllers, by adding arguments to the constructor.
Then you can use that in any method that you want.

    ```javascript
    import { Get, Post, Put, JsonController, Param, Body, QueryParam, Authorize, HeaderParam, Delete } from '../../../src/index';
    import { UserModel } from '../../models/models';
    import { isNil } from 'lodash';
    import { AuxiliaryFunctions } from '../../auxiliaryFunctions';

    @JsonController('/user')
    export class UserController {
        constructor(private aux: AuxiliaryFunctions) {}

        @Get('/search/:name')
        public queryparam(@Param('name') name: string, @HeaderParam('token') token: string) {
            this.aux.print(token);
            if (!isNil(name)) {
            var users = Utils.userList.filter(function(obj) {
                return obj.name === name;
            });
            }
            return users;
        }
    }
    ```
## Sockets
1. socket.io is integrated to our framework. Enable socket support by adding the `socket` property to the options.

    ```javascript
    const options = {
        controllers: [UserController],
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
    import { UserController } from '../controllers/user/user-controller';

    const options = {
        controllers: [UserController],
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
    import { IsString, IsNumber, IsArray } from '../../src/index'

    export class AddressModel {
        @IsString() public street: string;
        @IsNumber() public number: number;
    }

    export class UserModel {
        @IsNumber() public id: number;
        @IsString()  public name: string;
        @IsString()  public lastname: string;
        @IsNumber() public age: number;
        @IsArray(() => AddressModel) public address: AddressModel[];
    }
    ```
3. Visit the documentation page, in this example it would be at http://localhost:8086/v1/apidoc
