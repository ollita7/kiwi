import { Get, Post, JsonController, Authorize, Body, Param } from '../src/index';
import { Utils } from './utils';

@JsonController('/testcontroller3')
export class TestController3 {
    public utils: Utils;
    constructor(){
        this.utils = new Utils();
    }

    @Get('/getAction')
    public get(){
        this.utils.print();
        return this.getResponse();
    }

    @Authorize(['ADMIN', 'USER'])
    @Post('/postAction/:param1/:param2')
    public post(@Param('param2') param2: number, @Body() request: any, @Param('param1') param1: number){
        return {
            method: "post test2",
            request: request
        };
    }

    private getResponse(){
        return {
            method: "get test2",
        };
    }

}