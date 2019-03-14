import { IMiddleware } from './middleware';
import * as http from 'http';
import { IKiwiOptions } from 'src/types/types';
import { isNil, indexOf } from 'lodash';
export class CorsMiddleware implements IMiddleware {
    public execute(request: http.IncomingMessage, response: http.ServerResponse, next: any): any {
        let domains = ((global as any).options as IKiwiOptions).cors.domains;
        let origin = '';
        if(isNil(domains) || domains.length === 0){
            origin = '*';
        } else if(!isNil(request.headers.origin) && indexOf(domains, request.headers.orgin) > 0){
            origin = request.headers.orgin as string;
        }
        if (request.method === 'OPTIONS') {
            var headers = response.getHeaders();
            headers['Access-Control-Allow-Origin'] = origin;
            headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS';
            headers['Access-Control-Allow-Headers'] = response.getHeader('Access-Control-Allow-Headers') + ', X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept';
            response.writeHead(204, headers);
            response.end();
        }
        else {
            response.setHeader('Access-Control-Allow-Origin', origin);
            response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
            next();
        }
    }
} 