import { IMiddleware } from '../../src/middlewares/middleware';
import { MiddlewareAfter } from '../../src/decorators/middlewareAfter';
import * as http from 'http';

@MiddlewareAfter(1)
export class UserMiddleware implements IMiddleware{

    execute(request: http.IncomingMessage, response: http.ServerResponse, next: any){
        response.setHeader( 'Authorization', 'token' );
        console.log('UserMiddleware execute');
        next();
    }
}
