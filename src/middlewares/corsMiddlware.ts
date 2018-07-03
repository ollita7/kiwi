import { IMiddleware } from './middleware';
import * as http from 'http';
export class CorsMiddleware implements IMiddleware {
    public execute(request: http.IncomingMessage, response: http.ServerResponse): any{
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
} 