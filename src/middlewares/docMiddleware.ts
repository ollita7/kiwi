import { IMiddleware } from './middleware';
import * as http from 'http';
export class DocMiddleware implements IMiddleware {
    
    public execute(request: http.IncomingMessage, response: http.ServerResponse, next: any): any{
        if (request.url === '/doc') {
            return this.processDocumentations('/index.html', response);
        } else if (request.url.startsWith('/node_modules/swagger') || request.url.startsWith('/swagger')) {
            return this.processDocumentations(request.url, response);
        } else {
            return next();
        }
    }

    private processDocumentations(resource: string, response: any) {
        let pathToSwaggerUi = '.';
        if (resource === '/index.html'|| resource === '/swager.json') {
            pathToSwaggerUi = __dirname + '/../resources/documentation-ui';
        }
        const fs = require('fs');
        fs.readFile(`${pathToSwaggerUi}${resource}`, (err: any, data: any) => {
            if (/[a-zA-Z0-9]*.css/.test(resource)) {
                response.writeHead(200, { 'Content-Type': 'text/css' });
            } else if (/^\/[a-zA-Z0-9\/]*.js$/.test(resource)) {
                response.writeHead(200, { 'Content-Type': 'text/javascript' });
            }
            else if (/^\/[a-zA-Z0-9\/]*.json$/.test(resource)) {
                response.writeHead(200, { 'Content-Type': 'application/json' });
            } else {
                response.writeHead(200, { 'Content-Type': 'text/html' });
            }
            response.write(data);
            response.end();
        });
    
    }
} 