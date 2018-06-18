# KIWI Server
Its a simple node server to create rest services.

# Table of Contents
* [Sample](#sample)
* [Authorization](#authorization)
  
## Sample
1. Create your firs controller class `TestController.ts`
 ```javascript
 import { Get, Post, JsonController, Param, Body } from '../lib/index';

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
 
 2. After you create the controller you must create the server that use that controller.
 ```javascript
 import { createKiwiServer } from '../lib/index';
import { TestController } from './test-controller';

const options = {
    controllers: [TestController],
}
const server = createKiwiServer(options);
server.listen(8086);
```
 ## Authorization
 1. You have to specify on controller what actions need to be authorized. To do that you have a decorator @Authorization.
 In the sample you can see that we only need authorization to postAction. Also yo can put the authorization in the controller so all the actions must me authorized.
 
 ```javascript
 import { Get, Post, JsonController, Authorize } from '../lib/index';


@JsonController('/testcontroller2')
export class TestController2 {
    @Get('/getAction')
    public get(){
        return "get test2";
    }

    @Authorize(['ADMIN', 'USER'])
    @Post('/postAction')
    public post(){
        return "post test2";
    }

    public put(){
        return "put test2";
    }

    public delete(){
        return "delete test2";
    }
}
```

2. 

```javascript
import { createKiwiServer } from '../lib/index';
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
  
