import { IMiddleware } from './middleware';
import * as http from 'http';
export class LogMiddleware implements IMiddleware {
    public execute(request: http.IncomingMessage, response: http.ServerResponse, next: any): any{
        console.log(`${request.method} ${request.url} - ${new Date()}`);
        next();
    }
} 