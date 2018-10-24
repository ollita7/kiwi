import { IMiddleware } from '../src/middlewares/middleware';
import { MiddlewareAfter } from '../src/decorators/middlewareAfter';
import * as http from 'http';
import { Utils } from './utils';

@MiddlewareAfter(1)
export class TestMiddleware2 implements IMiddleware{
    
    execute(request: http.IncomingMessage, response: http.ServerResponse, next: any){
        response.setHeader( 'Authorization2', 'hola2' );
        next();
    }
}