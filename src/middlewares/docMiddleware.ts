import { IMiddleware } from './middleware';
import * as http from 'http';
import { replace } from 'lodash';

export class DocMiddleware implements IMiddleware {

    public execute(request: http.IncomingMessage, response: http.ServerResponse, next: any): any {
        let url = (global as any).options.prefix !== '' ? `${(global as any).options.prefix}/${(global as any).options.documentation.path}`
            : (global as any).options.documentation.path;
        url = replace(url, '//', '/');
        if (request.url === url) {
            return this.processDocumentations('/index.html', response);
        } else if (request.url.startsWith(`${(global as any).options.prefix}/node_modules/swagger`) || request.url.startsWith(`${(global as any).options.prefix}/swagger`)) {
            url = replace(request.url, (global as any).options.prefix, '');
            return this.processDocumentations(url, response);
        } else {
            return next();
        }
    }

    private processDocumentations(resource: string, response: any) {
        let pathToSwaggerUi = './';
        pathToSwaggerUi = replace(pathToSwaggerUi, '//', '/');
        if (resource === '/index.html' || resource === '/swager.json') {
            pathToSwaggerUi = __dirname + '/../resources/documentation-ui';
        }
        const fs = require('fs');
        fs.readFile(`${pathToSwaggerUi}${resource}`, (err: any, data: any) => {
            if(err){
                console.log(err);
                response.writeHead(404);
                response.end(`Resource ${pathToSwaggerUi}${resource} not found.`);
                return;
            }
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