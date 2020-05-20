import { Get, Post, JsonController, Param, Body, QueryParam, Authorize, HeaderParam } from '../../src/index';
import { Utils } from '../utils';
import { UserModel } from '../models/models';

@Authorize(['role1, role2'])
@JsonController('/testcontroller')
export class TestController {
    private request: any;
    private response: any;

    constructor(private utils: Utils) { }

    @Post('/test123')
    public test23(@Body() body: any) {
      return body;
    }

    @Post('/user')
    public nestedArray(@Body() user: UserModel) {
      return "";
    }

    @Get('/queryparam/:id')
    public queryparam(@QueryParam() object: UserModel, @Param('id') id: string, @HeaderParam('token1') token1: string,
        @HeaderParam('token2') token2: string) {
          this.response.statusCode = 201;
        return object;
    }

    @Get('/testinguy/:name')
    public get2(@Param('name') name: number) {
        return { name: name };
    }

    @Get('/getAction/:id/:id2/:id3')
    public get(@Param('id3') id: string, @Param('id2') id2: string, @Param('id') id3: string) {
        return "get test";
    }

    @Get('/getActionWithoutParam')
    public getActionWithoutParam() {
        return "get without params test";
    }

    @Post('/postAction/:id')
    public post(@Body() request: any, @Param('id') id: string) {
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

    @Get('/testHeaders')
    public testHeaders(@HeaderParam('h1') h1: string, @HeaderParam('h2') h2: string) {
        return {
            h1: h1,
            h2: h2
        }
    }
}
