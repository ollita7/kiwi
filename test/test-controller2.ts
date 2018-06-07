import { Get, Post, JsonController } from '../lib/index';

@JsonController('testcontroller2')
export class TestController2 {
    @Get('/getAction')
    public get(){
        return "get test2";
    }

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