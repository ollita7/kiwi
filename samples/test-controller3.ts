import { Get, Post, JsonController, Authorize, Body, Param } from '../src/index';
import { User } from './models/models';

@JsonController('/user')
export class TestController3 {
    constructor(){
    }

    @Post()
    public post(@Body() body: User){
        return body;
    }
}