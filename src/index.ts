import { IKiwiOptions } from './types/types';
import * as http from 'http';
import { isNil, findIndex, forEach } from 'lodash';
import { MetadataStorage } from './metadata/metadataStorage';
import { IActionExecutor, IMiddleware } from './metadata/types/metadata.types';
import { CorsMiddleware } from "./middlewares/corsMiddlware";
import { LogMiddleware } from "./middlewares/logMiddlware";
import { DocMiddleware } from './middlewares/docMiddleware';

export * from "./decorators/Get";
export * from "./decorators/Post";
export * from "./decorators/Put";
export * from "./decorators/Delete";
export * from "./types/types";
export * from "./decorators/jsonController";
export * from "./decorators/param";
export * from "./decorators/queryParam";
export * from "./decorators/body";
export * from "./decorators/authorize";
export * from "./decorators/middlewareBefore";
export * from "./decorators/middlewareAfter";
export * from "./middlewares/middleware";
export * from './middlewares/errorMiddleware';
export * from "./decorators/model";

let internalOptions: IKiwiOptions = {
    port: 8080,
    documentation: {
        enabled: false
    }
};

export function createKiwiServer(options?: IKiwiOptions) {
    internalOptions = options;
    (global as any).options = options;
    MetadataStorage.init(internalOptions);
    if (internalOptions.documentation.enabled) {
        MetadataStorage.middlewaresBefore.push({
            target: DocMiddleware
        })
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
        const beforeReponse = await executeMiddlewares(MetadataStorage.middlewaresBefore, request, response);
        if (isNil(beforeReponse)) {
            return;
        }

        const split_url = request.url.split('?');
        const url = split_url[0];
        const queryParam = split_url.length === 2 ? split_url[1] : null;

        const match = MetadataStorage.matchRoute(url, request.method);
        if (isNil(match)) {
            response.writeHead(404);
            response.end(`Method doesnt match`);
            return;
        }
        if (match.authorize) {
            let result = await internalOptions.authorization.apply(null, [request, match.roles]);
            if (!result) {
                response.writeHead(401);
                response.end(`Not athorized`);
                return;
            }
        }
        const index = findIndex(match.params, (param: any) => param.name === 'queryParam');
        match.paramValues[index] = parseQueryParam(queryParam);
        if (request.method !== 'GET') {
            let body = await parseBody(request);
            const index = findIndex(match.paramValues, (param: string) => param === undefined);
            match.paramValues[index] = body;
        }
        const result = await execute(match, request, response);
        const afterReponse = await executeMiddlewares(MetadataStorage.middlewaresAfter, request, response);
        if (isNil(afterReponse)) {
            return;
        }
        response.setHeader("Content-Type", "application\json");
        response.end(JSON.stringify(result));
        return response;
    } catch (ex) {
        console.log(`ERROR: ${ex}`)
        response.writeHead(500);
        response.end(`Internal error`);
    }
}

function parseQueryParam(queryParams: string){
    if (isNil(queryParams)){
        return null;
    } 
    const obj:any = {};
    const params = queryParams.split('&');
    forEach(params, (param) =>{
        const val = param.split('=');
        obj[val[0]] = val[1];
    })
    return obj;

}

async function parseBody(request: http.IncomingMessage) {
    var p = new Promise((resolve, reject) => {
        let body = '';
        request.on('data', chunk => body += chunk);
        request.on('end', () => resolve(body));
    });

    var body = await p.then((result: any) => {
        if(isNil(result)){
            return null;
        }
        return JSON.parse(result);
    });
    return body;
}

async function execute(match: IActionExecutor, request: http.IncomingMessage, response: http.ServerResponse) {
    const instance: any = getInstance(match.executor);
    const result = await instance[match.fn.name].apply(instance, match.paramValues);
    return result;
}

async function executeMiddlewares(middlewares: Array<IMiddleware>,request: http.IncomingMessage, response: http.ServerResponse) {
    var resolver: any = Promise.resolve();
    forEach(middlewares, (middleware: IMiddleware) => {
        resolver = resolver.then(() => {
            return new Promise((resolve, reject) => {
                const instance: any = getInstance(middleware.target.prototype);
                return instance.execute.apply(instance, [request, response, resolve]);
            });
        });
    });
    resolver = resolver.then(() => {
        return true;
    });
    const result = await resolver;
    return result;
}

function getInstance<T>(prototype: any , ...args: any[]): T {
    return new prototype.constructor();
}
