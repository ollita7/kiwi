import { IKiwiOptions } from './types/kiwiOptions';
import * as http from 'http';
import { isNil } from 'lodash';
import { MetadataStorage } from './metadata/metadataStorage';
export * from "./decorators/Get";
export * from "./decorators/Post";
export * from "./decorators/Put";
export * from "./decorators/Delete";
export * from "./types/KiwiOptions";
export * from "./decorators/jsonController";
export * from "./decorators/param";
export * from "./decorators/body";
export * from "./decorators/authorize";

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
    console.log(getMetadataStorage().routes);
    return http.createServer(processRequest);
}

async function processRequest(request: http.IncomingMessage , response: http.ServerResponse) {
    if (request.method === 'OPTIONS' && internalOptions.cors) {
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return;
    }
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
    let params = match.paramValues;
    response.writeHead(200, { "Content-Type": "application\json" });
    if (request.method !== 'GET') {
        let body = await parseBody(request);
    }

    response.end(JSON.stringify(match.fn.apply(null, params)));
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