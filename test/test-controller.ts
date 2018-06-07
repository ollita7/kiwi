import { Get, Post, JsonController } from '../lib/index';

@JsonController('testcontroller')
export class TestController {
    @Get('/getAction')
    public get(){
        return "get test";
    }

    @Post('/postAction')
    public post(){
        return "post test";
    }

    public put(){
        return "put test";
    }

    public delete(){
        return "delete test";
    }
}