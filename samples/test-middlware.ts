import { IMiddleware } from '../src/middlewares/middleware';
import { MiddlewareBefore } from '../src/decorators/middlewareBefore';
import * as http from 'http';
@MiddlewareBefore(3)
export class TestMiddleware implements IMiddleware{
    execute(request: http.IncomingMessage, response: http.ServerResponse, next: any){
        response.setHeader( 'Authorization', 'hola' );
        next();
    }
}