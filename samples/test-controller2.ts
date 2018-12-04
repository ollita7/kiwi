import { Get, Post, JsonController, Authorize, Body, Param } from '../src/index';


@JsonController('/testcontroller2')
export class TestController2 {
    @Authorize(['ADMIN', 'USER'])
    @Get('/getAction')
    public get(){
        return "get test2";
    }

    @Post('/postAction/:param1/:param2')
    public post(@Param('param2') param2: number, @Body() request: any, @Param('param1') param1: number){
        return {
            method: "post test2",
            request: request
        };
    }

}