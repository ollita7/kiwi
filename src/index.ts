import { IKiwiOptions } from './types/types';
import * as http from 'http';
import { isNil, findIndex, forEach } from 'lodash';
import { MetadataStorage } from './metadata/metadataStorage';
import { IActionExecutor, IMiddleware } from './metadata/types/metadata.types';
import {CorsMiddleware} from "./middlewares/corsMiddlware";
import {LogMiddleware} from "./middlewares/logMiddlware";
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
};

export function getMetadataStorage(): MetadataStorage {
    if (!(global as any).metadataStorage)
        (global as any).metadataStorage = new MetadataStorage();
    return (global as any).metadataStorage;
}

export function createKiwiServer(options?: IKiwiOptions) {
    internalOptions = options;
    getMetadataStorage().init();
    if(internalOptions.log){
        getMetadataStorage().middlewaresBefore.push({
            target: LogMiddleware
        })
    }
    if(internalOptions.cors){
        getMetadataStorage().middlewaresBefore.push({
            target: CorsMiddleware
        })
    }
    return http.createServer(processRequest);
}

async function processRequest(request: http.IncomingMessage, response: http.ServerResponse) {
    const match = getMetadataStorage().matchRoute(request.url, request.method);
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
    response.setHeader("Content-Type", "application\json" );
    response.end(JSON.stringify(result));
    return response;
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

async function execute(match: IActionExecutor, request: http.IncomingMessage, response: http.ServerResponse){
    let middlewares = getMetadataStorage().middlewaresBefore;
    forEach(middlewares, (middleware: IMiddleware)=>{
        middleware.target.prototype.execute.apply(null, [request, response])
    });
    const result = await match.fn.apply(null, match.paramValues);
    middlewares = getMetadataStorage().middlewaresAfter;
    forEach(middlewares, (middleware: IMiddleware)=>{
        middleware.target.prototype.execute.apply(null, [request, response])
    });
    return result;
}