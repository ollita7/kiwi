import { IMiddleware } from '../src/middlewares/middleware';
import { MiddlewareAfter } from '../src/decorators/MiddlewareAfter';
import * as http from 'http';
import { Utils } from './utils';

@MiddlewareAfter(1)
export class TestMiddleware2 implements IMiddleware{
    public utils: Utils;
    constructor(){
        this.utils = new Utils();
    }
    execute(request: http.IncomingMessage, response: http.ServerResponse, next: any){
        this.utils.print();
        response.setHeader( 'Authorization2', 'hola2' );
        next();
    }
}