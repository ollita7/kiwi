import { Get, Post, JsonController, Authorize, Body, Param, QueryParam } from '../src/index';
import { User } from './models/models';
import { Utils } from './utils';

@JsonController('/user')
export class TestController3 {
    constructor(private utils: Utils){
    }

    @Post('/login/:id')
    public post(@Body() body: User, @Param('id') id : number){
        return body;
    }

}
