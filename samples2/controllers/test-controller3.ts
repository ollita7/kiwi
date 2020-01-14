import { Get, Post, JsonController, Authorize, Body, Param, QueryParam } from '../../src/index';
import { UserModel } from '../models/models';
import { Utils } from '../utils';

@JsonController('/testcontroller3')
export class TestController3 {
    constructor(private utils: Utils){
    }

    @Post('/login/:id')
    public post(@Body() body: UserModel, @Param('id') id : number){
        return body;
    }

}
