import { Get, Post, JsonController, Param, Body } from '../lib/index';

@JsonController('/testcontroller')
export class TestController {
    @Get('/getAction/:id/:id2/:id3')
    public get(@Param('id') id: string, @Param('id2') id2: string, @Param('id3') id3: string) {
        return "get test";
    }

    @Post('/postAction/:id')
    public post(@Param('id') id: string, @Body() request: any) {
        return {
            method: "post test",
            request: request
        };
    }

    public put() {
        return "put test";
    }

    public delete() {
        return "delete test";
    }
}