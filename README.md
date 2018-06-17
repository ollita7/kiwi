# KIWI Server
Its a simple node server to create rest services.

# Table of Contents

  * [Sample] (#Sample)
  
## Controller sample
1. Create your firs controller class `TestController.ts`
 ```javascript
 import { Get, Post, JsonController, Param, Body } from '../lib/index';

 @JsonController('/testcontroller')
 export class TestController {

     @Get('/getAction/:id/:id2/:id3')
     public get(@Param('id') id: string, @Param('id2') id2: string, @Param('id3') id3: string) {
         return "get test";
     }

     @Get('/getActionWithoutParam')
     public getActionWithoutParam() {
         return "get without params test";
     }

     @Post('/postAction/:id')
     public post( @Body() request: any, @Param('id') id: string) {
         return {
             method: "post test",
             request: request
         };
     }

     @Get('/postAction/:id')
     public getSame(@Param('id') id: string) {
         return {
             method: "get same url post test",
         };
     }

     public put() {
         return "put test";
     }

     public delete() {
         return "delete test";
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
 
  
