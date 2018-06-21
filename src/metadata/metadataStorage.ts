import { ActionType } from './types/actionType';
import { forEach, isNil, find } from 'lodash';

export class MetadataStorage{
    public actions: ActionType[];
    public controllers: any[];
    public params: any[];
    public middlewares: any[];
    public interceptors: any[];
    public authorize: any[];
    public routes: any;

    public getRoutes(){
        forEach(this.actions, (action) => {
            const controller = find(this.controllers, (controller) => {
                return action.className == controller.target.name;
            });
            if (_.isNil(this.routes[`${controller.path}${action.path}`])) {
                this.routes[`${controller.path}${action.path}`] = {};
            }

            const authorize = _.find(this.authorize, (auth) => {
                return (auth.methodName === action.methodName && auth.className === controller.target.name);
            });

            this.routes[`${controller.path}${action.path}`][action.method] = {
                fn: controller.target.prototype[action.methodName],
                params: [],
                authorize: !_.isNil(authorize),
                roles: !_.isNil(authorize)? authorize.roles : []
            };
            var params = _.filter(this.params, (param) => {
                return param.className === action.className && action.methodName === param.methodName;
            });
            forEach(params, (param) => {
                this.routes[`${controller.path}${action.path}`][action.method].params[param.order] = param.name;
            });

        });
    }

    public matchRoute(route: string, httpMethod: string){
        let match = null;
        httpMethod = httpMethod.toLowerCase();
        var params = [];
        const keys = Object.keys(this.routes);
        var foundMatch = false;
        var i = 0;
        while (!foundMatch && i < keys.length) {
            var exp = `^${keys[i].replace(/:[^\s/]+/g, '([\\w-])')}$`;
            var routeMatcher = new RegExp(exp);
            if (routeMatcher.test(route)) {
                var urlParamsValues = _.drop(routeMatcher.exec(route));
                var routeMatcher2 = new RegExp(keys[i].replace(/:[^\s/]+/g, ':([\\w-]+)'));
                var urlParamNames = _.drop(routeMatcher2.exec(keys[i]));
                match = this.routes[keys[i]][httpMethod];
                match.paramValues = params;
                foundMatch = true;
            }
            i++;
        }
        return match;
    }
}