import { IKiwiOptions } from './types/types';
import * as http from 'http';
import { Server } from "socket.io";
import { isNil, findIndex, forEach, filter, find } from 'lodash';
import { KiwiMetadataStorage } from './metadata/metadataStorage';
import { IActionExecutor, IMiddleware } from './metadata/types/metadata.types';
import { CorsMiddleware } from './middlewares/corsMiddlware';
import { LogMiddleware } from './middlewares/logMiddlware';
import { DocMiddleware } from './middlewares/docMiddleware';
import { ParserHelper } from './helpers/parser';
import { ON_EXCEPTION } from './events';
import { Param } from './decorators/param';
// Import events module
var events = require('events');
export * from './validators';
export * from './decorators/get';
export * from './decorators/post';
export * from './decorators/put';
export * from './decorators/delete';
export * from './decorators/isArray';
export * from './decorators/isObject';
export * from './types/types';
export * from './decorators/jsonController';
export * from './decorators/param';
export * from './decorators/queryParam';
export * from './decorators/headerParam';
export * from './decorators/body';
export * from './decorators/context';
export * from './decorators/authorize';
export * from './decorators/middlewareBefore';
export * from './decorators/middlewareAfter';
export * from './middlewares/middleware';
export * from './middlewares/errorMiddleware';
export * from './events';

let internalOptions: IKiwiOptions = {
  port: 8080,
  documentation: {
    enabled: false
  },
  prefix: '',
  socket: {
    path: '',
    enabled: false
  }
};

export function createKiwiServer(options: IKiwiOptions, callback?: any) {
  internalOptions = options;
  (global as any).options = options;
  KiwiMetadataStorage.init(internalOptions);
  if (internalOptions.documentation.enabled) {
    KiwiMetadataStorage.middlewaresBefore.push({
      target: DocMiddleware
    });
    KiwiMetadataStorage.generateDoc(options);
  }
  if (internalOptions.log) {
    KiwiMetadataStorage.middlewaresBefore.push({
      target: LogMiddleware
    });
  }
  if (internalOptions.cors && internalOptions.cors.enabled) {
    KiwiMetadataStorage.middlewaresBefore.push({
      target: CorsMiddleware
    });
  }

  // Create an eventEmitter object
  (global as any).events = new events.EventEmitter();

  const server = http.createServer(processRequest);
  if (internalOptions.socket && internalOptions.socket.enabled) {
    (global as any).io = new Server(server, {
      path: `${internalOptions.socket.path}/socket.io`
    });
  }
  server.listen(options.port, () => {
    console.log(`--------- SERVER STARTED on port ${options.port}---------`);
    if (callback) {
      callback();
    }
  });
}

export function addKiwiListener(name: string, listener: any){
  (global as any).events.addListener(name, listener);
}

export function emitKiwiEvent(name: string, data?: any){
  (global as any).events.emit(name, data);
}

export function getKiwiEmitter(){
  return (global as any).events;
}

export function getSocket() {
  return (global as any).io;
}

export async function processRequest(request: any, response: http.ServerResponse) {
  try {
    const beforeReponse = await executeMiddlewares(KiwiMetadataStorage.middlewaresBefore, request, response);
    if (isNil(beforeReponse)) {
      return;
    }

    const split_url = request.url.split('?');
    const url = split_url[0];
    const queryParam = split_url.length === 2 ? split_url[1] : null;

    const match = KiwiMetadataStorage.matchRoute(url, request.method);
    if (isNil(match)) {
      response.writeHead(404);
      response.end(`Method doesnt match`);
      return;
    }

    if (match.authorize && KiwiMetadataStorage.options.authorization != null) {
      let result = await KiwiMetadataStorage.options.authorization.apply(null, [request, match.roles]);

      if (!result) {
        response.writeHead(401);
        response.end(`Not authorized`);
        return;
      } else if (!isNaN(result.result)) {
        const code = result.result === false ? 401 : result.result;
        response.writeHead(code);
        response.end(result.message);
        return;
      }
    }
    const index = findIndex(match.params, (param: any) => param.name === 'queryParam');
    match.paramValues[index] = parseQueryParam(queryParam);
    if (request.method !== 'GET') {
      const parser = new ParserHelper();
      let body = await parser.parse(request);
      const index = findIndex(match.paramValues, (param: string) => param === undefined);
      match.paramValues[index] = body;
    }

    // Get context
    const context_index = findIndex(match.params, (param: any) => param.type === 'context');
    if (context_index >= 0 ) {
      const param = find(match.params, (param: any) => param.type === 'context');
      match.paramValues[context_index] = request[param.name]
    }

    parseHeaderParams(request, match);
    const result = await execute(match, request, response);
    const afterReponse = await executeMiddlewares(KiwiMetadataStorage.middlewaresAfter, request, response);
    if (isNil(afterReponse)) {
      return;
    }
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(result));
    return response;
  } catch (ex) {
    (global as any).events.emit(ON_EXCEPTION, ex);
    console.log(`ERROR: ${ex}`);
    response.writeHead(500);
    response.end(`Internal error`);
  }
}

function parseQueryParam(queryParams: string) {
  if (isNil(queryParams)) {
    return null;
  }
  const obj: any = {};
  const params = queryParams.split('&');
  forEach(params, param => {
    const val = param.split('=');
    obj[val[0]] = decodeURIComponent(val[1]);
  });
  return obj;
}

function parseHeaderParams(request: http.IncomingMessage, match: IActionExecutor) {
  const headerParams = filter(match.params, (param: any) => param.type === 'headerParam');
  forEach(headerParams, headerParam => {
    const index = findIndex(match.params, (param: any) => param.name === headerParam.name);
    match.paramValues[index] = request.headers[headerParam.name];
  });
  return match;
}

async function execute(match: IActionExecutor, request: http.IncomingMessage, response: http.ServerResponse) {
  const instance: any = getInstance(match.executor);
  instance.__proto__.request  = request;
  instance.__proto__.response  = response;
  if (isNil(match.paramValues)) {
    match.paramValues = [];
  }
  match.paramValues.push(request);
  match.paramValues.push(response);
  const result = await instance[match.fn.name].apply(instance, match.paramValues);
  return result;
}

async function executeMiddlewares(middlewares: Array<IMiddleware>, request: http.IncomingMessage, response: http.ServerResponse) {
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

function getInstance<T>(prototype: any): T {
  const params: any[] = Reflect.getMetadata('design:paramtypes', prototype.constructor) || [];
  let args: any[] = [];
  forEach(params, param => {
    var instance = new param.prototype.constructor();
    args.push(instance);
  });
  return new prototype.constructor(...args);
}
