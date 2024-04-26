import { IAuthorize, IAction, IRouter, IActionExecutor, IParam, IMiddleware } from './types/metadata.types';
import { forEach, isNil, find, filter, drop, findIndex, orderBy, replace, split } from 'lodash';
import { Metadata } from './metadata';
import { IKiwiOptions } from '../types/types';
import { getFromContainer, IsOptional, IsString, MaxLength, MetadataStorage } from 'class-validator'
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import { defaultMetadataStorage } from 'class-transformer/storage'

export class KiwiMetadataStorage {
    public static get actions(): IAction[] {
        if (!(global as any).metadata)
            (global as any).metadata = new Metadata();
        return (global as any).metadata.actions;
    };

    public static get options(): IKiwiOptions {
        if (!(global as any).metadata)
            (global as any).options = new Metadata();
        return (global as any).metadata.options;
    };

    public static set options(value: IKiwiOptions) {
        if (!(global as any).metadata)
            (global as any).metadata = new Metadata();
        (global as any).metadata.options = value;
    }

    public static get controllers(): any[] {
        if (!(global as any).metadata)
            (global as any).metadata = new Metadata();
        return (global as any).metadata.controllers;
    };

    public static get params(): any[] {
        if (!(global as any).metadata)
            (global as any).metadata = new Metadata();
        return (global as any).metadata.params;
    };

    public static get middlewaresBefore(): IMiddleware[] {
        if (!(global as any).metadata)
            (global as any).metadata = new Metadata();
        return (global as any).metadata.middlewaresBefore;
    };

    public static get middlewaresAfter(): IMiddleware[] {
        if (!(global as any).metadata)
            (global as any).metadata = new Metadata();
        return (global as any).metadata.middlewaresAfter;
    };

    public static get interceptors(): any[] {
        if (!(global as any).metadata)
            (global as any).metadata = new Metadata();
        return (global as any).metadata.interceptors;
    };

    public static get authorize(): IAuthorize[] {
        if (!(global as any).metadata)
            (global as any).metadata = new Metadata();
        return (global as any).metadata.authorize;
    };

    public static get routes(): IRouter {
        if (!(global as any).metadata)
            (global as any).metadata = new Metadata();
        return (global as any).metadata.routes;
    };

    public static init(internalOptions: IKiwiOptions) {
        if (!(global as any).metadata)
            (global as any).metadata = new Metadata();
        KiwiMetadataStorage.options = internalOptions;
        const actions = filter(KiwiMetadataStorage.actions, (action) => {
            return findIndex(internalOptions.controllers, (controller: any) => { return controller.name == action.className; }) >= 0;
        });
        forEach(KiwiMetadataStorage.actions, (action) => {
            const controller = find(KiwiMetadataStorage.controllers, (controller) => {
                return action.className == controller.target.name;
            });
            const path = KiwiMetadataStorage.generatePath(controller.path, action.path, internalOptions.prefix)
            if (isNil(KiwiMetadataStorage.routes[path])) {
                KiwiMetadataStorage.routes[path] = {};
            }

            const authorize = find(KiwiMetadataStorage.authorize, (auth) => {
                return (isNil(auth.methodName) && auth.className === controller.target.name) ||
                    (auth.methodName === action.methodName && auth.className === controller.target.name);
            });
            //console.log(`${action.method.toUpperCase()} ${path}`);
            KiwiMetadataStorage.routes[path][action.method] = {
                fn: controller.target.prototype[action.methodName],
                executor: controller.target.prototype,
                params: [],
                contentType: action.contentType,
                authorize: !isNil(authorize),
                roles: !isNil(authorize) ? authorize.roles : []
            };
            var params = filter(KiwiMetadataStorage.params, (param) => {
                return param.className === action.className && action.methodName === param.methodName;
            });
            KiwiMetadataStorage.routes[path][action.method].params = params;

        });
        KiwiMetadataStorage.orderMiddlewares(internalOptions);
    }

    public static matchRoute(route: string, httpMethod: string): IActionExecutor {
        let match: IActionExecutor = null;
        httpMethod = httpMethod.toLowerCase();
        const keys = Object.keys(KiwiMetadataStorage.routes);
        var foundMatch = false;
        var i = 0;
        while (!foundMatch && i < keys.length) {
            var exp = `^${keys[i].replace(/:[^\s/]+/g, '([\\w-=]*)')}$`;
            var routeMatcher = new RegExp(exp);
            if (routeMatcher.test(route)) {
                var urlParamsValues = drop(routeMatcher.exec(route));
                var routeMatcher2 = new RegExp(keys[i].replace(/:[^\s/]+/g, ':([\\w-=]*)'));
                var urlParamNames = drop(routeMatcher2.exec(keys[i]));
                match = KiwiMetadataStorage.routes[keys[i]][httpMethod];
                if (!isNil(match)) {
                    match.paramValues = this.orderParams(urlParamNames, urlParamsValues, match);
                    foundMatch = true;
                }
            }
            i++;
        }
        return match;
    }

    public static orderMiddlewares(internalOptions: IKiwiOptions) {
        let middlewaresAfter = filter((global as any).metadata.middlewaresAfter, (middleware: IMiddleware) => {
            return findIndex(internalOptions.middlewares, (middlewareOption: any) => { return middlewareOption.name == middleware.target.name; }) >= 0;
        });
        let middlewaresBefore = filter((global as any).metadata.middlewaresBefore, (middleware: IMiddleware) => {
            return findIndex(internalOptions.middlewares, (middlewareOption: any) => { return middlewareOption.name == middleware.target.name; }) >= 0;
        });
        (global as any).metadata.middlewaresAfter = orderBy(middlewaresAfter, ['order'], ['asc']);
        (global as any).metadata.middlewaresBefore = orderBy(middlewaresBefore, ['order'], ['asc']);
    }

    public static async  generateDoc(options?: IKiwiOptions) {
        var fs = require('fs');
        const swagger: any = {
            schemes: ["https", "http"],
            paths: {},
            openapi: "3.0.0",
            components: {}
        };
        const metadatas = (getFromContainer(MetadataStorage) as any).validationMetadatas;
        const schemas = validationMetadatasToSchemas(metadatas, {
            refPointerPrefix: '#/components/schemas/',
            classTransformerMetadataStorage: <any>defaultMetadataStorage
        })
        swagger['components']['schemas'] = schemas;

        const routes = KiwiMetadataStorage.routes;
        forEach(Object.keys(routes), (url: string) => {
            swagger.paths[url] = {};
            forEach(Object.keys(routes[url]), (method) => {
                let path = replace(url, options.prefix, '');
                const tags = split(path, '/');
                swagger.paths[url][method] = {
                    consumes: ["application/json"],
                    produces: ["application/json"],
                    parameters: this.getParameters(routes[url][method].params),
                    tags: [tags[1]]
                }
                const body = this.getRequestBody(routes[url][method].params)
                if(!isNil(body)){
                    swagger.paths[url][method]['requestBody'] = body;
                }

            })
        });
        const resultFile = fs.writeFileSync(`swagger.json`, JSON.stringify(swagger, null, 4), 'utf8');
    }

    private static generatePath(controller: string, action: any, prefix: string) {
        let path = isNil(prefix) ? `${controller}${action}` : `${prefix}${controller}${action}`;
        path = replace(path, '//', '/');
        return path;
    }

    private static orderParams(paramNames: Array<string>, paramValues: Array<string>, match: IActionExecutor): Array<any> {
        const result: Array<any> = [];
        forEach(match.params, (param: IParam) => {
            const index = findIndex(paramNames, (name) => name === param.name);
            result[param.order] = isNaN(Number(paramValues[index])) ? paramValues[index] : parseInt(paramValues[index]);
        });
        return result;
    }

    private static getParameters(params: Array<IParam>) {
        const swParams: Array<any> = [];
        forEach(params, (param) => {
            if (param.type === 'query') {
                const types = Reflect.getMetadata('design:paramtypes', param.object, param.methodName);
                const type = types[param.order];
                swParams.push(
                    {
                        name: param.name,
                        in: "path",
                        required: true,
                        schema: {
                            type: type.name
                        }
                    }
                )
            }
        })
        return swParams;
    }

    private static getRequestBody(params: Array<IParam>) {
        const body = find(params, (param) => param.type === 'body');
        if(isNil(body)){
            return null;
        }
        const types = Reflect.getMetadata('design:paramtypes', body.object, body.methodName);
        const type = types[body.order];
        const requestBody = {
            content: {
                "application/json": {
                    schema: {
                        "$ref": `#/components/schemas/${type.name}`
                    }
                }
            },
            "description": type.name,
            "required": true
        }
        return requestBody;
    }
}
