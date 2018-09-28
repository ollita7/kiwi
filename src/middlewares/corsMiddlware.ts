import { IMiddleware } from './middleware';
import * as http from 'http';
export class CorsMiddleware implements IMiddleware {
    public execute(request: http.IncomingMessage, response: http.ServerResponse, next: any): any{
        if (request.method === 'OPTIONS') {
            var headers: any = {};
            headers['Access-Control-Allow-Origin'] = '*';
            headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS';
            headers['Access-Control-Allow-Credentials'] = false;
            headers['Access-Control-Max-Age'] = '86400';
            headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept';
            response.writeHead(204, headers);
            response.end();
        } else{
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
            next();
        }
    }
} 