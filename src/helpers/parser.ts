import { isNil } from 'lodash';
import * as http from 'http';

export class ParserHelper {
    async parse(request: http.IncomingMessage) {
        var p = new Promise((resolve, reject) => {
            let body = '';
            request.on('data', chunk => body += chunk);
            request.on('end', () => resolve(body));
        });
    
        var body = await p.then((result: any) => {
            if (isNil(result) || result === '') {
                return null;
            }
            if(request.headers["content-type"].startsWith("application/json")){
                return JSON.parse(result);
            }
            return result;
        });
        return body;
    }
}