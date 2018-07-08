import { Get, Post, JsonController, Param, Body } from '../src/index';

@JsonController('/testcontroller')
export class TestController {
    
    @Get('/getAction/:id/:id2/:id3')
    public get(@Param('id') id: string, @Param('id2') id2: string, @Param('id3') id3: string) {
        return "get test";
    }

    @Get('/getActionWithoutParam')
    public getActionWithoutParam() {
        return "get without params test";
    }

    @Post('/postAction/:id')
    public post( @Body() request: any, @Param('id') id: string) {
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
}