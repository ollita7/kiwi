import { IAuthorize, IAction, IRoute } from './types/metadata.types';
import { forEach, isNil, find, filter, drop } from 'lodash';

export class MetadataStorage{
    public actions: IAction[];
    public controllers: any[];
    public params: any[];
    public middlewares: any[];
    public interceptors: any[];
    public authorize: IAuthorize[];
    public routes: any;

    constructor(){
        this.actions = [];
        this.controllers = [];
        this.params = [];
        this. middlewares = [];
        this.interceptors = [];
        this.authorize = [];
        this.routes = [];
    }

    public init(){
        forEach(this.actions, (action) => {
            const controller = find(this.controllers, (controller) => {
                return action.className == controller.target.name;
            });
            if (isNil(this.routes[`${controller.path}${action.path}`])) {
                this.routes[`${controller.path}${action.path}`] = [];
            }

            const authorize = find(this.authorize, (auth) => {
                return (auth.methodName === action.methodName && auth.className === controller.target.name);
            });

            this.routes[`${controller.path}${action.path}`][action.method] = {
                fn: controller.target.prototype[action.methodName],
                params: [],
                authorize: isNil(authorize),
                roles: !isNil(authorize)? authorize.roles : []
            };
            var params = filter(this.params, (param) => {
                return param.className === action.className && action.methodName === param.methodName;
            });
            forEach(params, (param) => {
                this.routes[`${controller.path}${action.path}`][action.method].params[param.order] = param.name;
            });

        });
    }

    public matchRoute(route: string, httpMethod: string): IRoute{
        let match: IRoute = null;
        httpMethod = httpMethod.toLowerCase();
        const keys = Object.keys(this.routes);
        var foundMatch = false;
        var i = 0;
        while (!foundMatch && i < keys.length) {
            var exp = `^${keys[i].replace(/:[^\s/]+/g, '([\\w-])')}$`;
            var routeMatcher = new RegExp(exp);
            if (routeMatcher.test(route)) {
                var urlParamsValues = drop(routeMatcher.exec(route));
                var routeMatcher2 = new RegExp(keys[i].replace(/:[^\s/]+/g, ':([\\w-]+)'));
                var urlParamNames = drop(routeMatcher2.exec(keys[i]));
                match = this.routes[keys[i]][httpMethod];
                match.paramValues = [];
                foundMatch = true;
            }
            i++;
        }
        return match;
    }
}