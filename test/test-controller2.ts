import { Get, Post, JsonController, Authorize, Body } from '../src/index';


@JsonController('/testcontroller2')
export class TestController2 {
    @Get('/getAction')
    public get(){
        return "get test2";
    }

    @Authorize(['ADMIN', 'USER'])
    @Post('/postAction')
    public post(@Body() request: any){
        return {
            method: "post test2",
            request: request
        };
    }

}