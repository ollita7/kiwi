import { IMiddleware } from '../src/middlewares/middleware';
import { MiddlewareBefore } from '../src/decorators/middlewareBefore';
import * as http from 'http';
@MiddlewareBefore()
export class TestMiddleware implements IMiddleware{
    execute(request: http.IncomingMessage, response: http.ServerResponse){
        response.setHeader( 'Authorization', 'hola' );
        console.log('TestMiddleware execute');
        return;
    }
}