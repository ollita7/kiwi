import { IKiwiOptions } from './types/types';
import * as http from 'http';
import { isNil, findIndex, forEach } from 'lodash';
import { MetadataStorage } from './metadata/metadataStorage';
import { IActionExecutor, IMiddleware } from './metadata/types/metadata.types';
import { CorsMiddleware } from "./middlewares/corsMiddlware";
import { LogMiddleware } from "./middlewares/logMiddlware";
export * from "./decorators/Get";
export * from "./decorators/Post";
export * from "./decorators/Put";
export * from "./decorators/Delete";
export * from "./types/types";
export * from "./decorators/jsonController";
export * from "./decorators/param";
export * from "./decorators/body";
export * from "./decorators/authorize";
export * from "./decorators/middlewareBefore";
export * from "./decorators/middlewareAfter";
export * from "./middlewares/middleware";

let internalOptions: IKiwiOptions = {
    port: 8080
};

export function createKiwiServer(options?: IKiwiOptions) {
    internalOptions = options;
    MetadataStorage.init();
    if (internalOptions.documentation) {
        MetadataStorage.generateDoc();
    }
    if (internalOptions.log) {
        MetadataStorage.middlewaresBefore.push({
            target: LogMiddleware
        })
    }
    if (internalOptions.cors) {
        MetadataStorage.middlewaresBefore.push({
            target: CorsMiddleware
        })
    }

    const server = http.createServer(processRequest);
    server.listen(options.port, () => {
        console.log(`--------- SERVER STARTED on port ${options.port}---------`);
    });
}

async function processRequest(request: http.IncomingMessage, response: http.ServerResponse) {
    try {
        console.log(`${request.method.toUpperCase()} ${request.url}`);
        if (request.url === '/doc') {
            processDocumentations('/index.html', response);
            return;
        }
        if (request.url.startsWith('/swagger')) {
            processDocumentations(request.url, response);
            return;
        }
        const match = MetadataStorage.matchRoute(request.url, request.method);
        if (isNil(match)) {
            response.writeHead(404);
            response.end(`Method doesnt match`);
            return;
        }
        if (match.authorize) {
            if (!internalOptions.authorization.apply(null, match.roles)) {
                response.writeHead(401);
                response.end(`Not athorized`);
                return;
            }
        }

        if (request.method !== 'GET') {
            let body = await parseBody(request);
            const index = findIndex(match.paramValues, (param: string) => param === undefined);
            match.paramValues[index] = body;
        }
        const result = await execute(match, request, response);
        response.setHeader("Content-Type", "application\json");
        response.end(JSON.stringify(result));
        return response;
    } catch (ex) {
        console.log(`ERROR: ${ex}`)
        response.writeHead(500);
        response.end(`Internal error`);
    }
}

async function parseBody(request: http.IncomingMessage) {
    var p = new Promise((resolve, reject) => {
        let body = '';
        request.on('data', chunk => body += chunk);
        request.on('end', () => resolve(body));
    });

    var body = await p.then((result: any) => {
        return JSON.parse(result);
    });
    return body;
}

function processDocumentations(resource: string, response: any) {
    const pathToSwaggerUi = './src/documentation-ui';
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

async function execute(match: IActionExecutor, request: http.IncomingMessage, response: http.ServerResponse) {
    let middlewares = MetadataStorage.middlewaresBefore;
    forEach(middlewares, (middleware: IMiddleware) => {
        middleware.target.prototype.execute.apply(null, [request, response])
    });
    const result = await match.fn.apply(null, match.paramValues);
    middlewares = MetadataStorage.middlewaresAfter;
    forEach(middlewares, (middleware: IMiddleware) => {
        middleware.target.prototype.execute.apply(null, [request, response])
    });
    return result;
}