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
        const beforeReponse = await executeBefore(request, response)
        if (isNil(beforeReponse)) {
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
        const afterReponse = await executeAfter(request, response)
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

async function execute(match: IActionExecutor, request: http.IncomingMessage, response: http.ServerResponse) {
    const instance: any = getInstance(match.executor);
    const result = await instance[match.fn.name].apply(instance, match.paramValues);
    return result;
}

async function executeBefore(request: http.IncomingMessage, response: http.ServerResponse) {
    const middlewares = MetadataStorage.middlewaresBefore;
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

async function executeAfter(request: http.IncomingMessage, response: http.ServerResponse) {
    const middlewares = MetadataStorage.middlewaresAfter;
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