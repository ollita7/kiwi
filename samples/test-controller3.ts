import { Get, Post, JsonController, Authorize, Body, Param } from '../src/index';
import { User } from './models/models';
import { Utils } from './utils';

@JsonController('/user')
export class TestController3 {
    constructor(private utils: Utils){
    }

    @Post('/login')
    public post(@Body() body: User){
        return body;
    }
}