var _ = require('lodash');
var MetadataStorage = (function () {

    function MetadataStorage() {
        this.actions = [];
        this.controllers = [];
        this.routes = [];
        this.params = [];
        this.middlewares = [];
        this.interceptors = [];
    }

    MetadataStorage.prototype.getRoutes = function () {
        _.forEach(this.actions, (action) => {
            const controller = _.find(this.controllers, (controller) => {
                return action.className == controller.target.name;
            });
            //TODO: Check if path is already on routes.
            //TODO; improve the way we are storing the metadata.
            this.routes[`${controller.path}${action.path}`] = [];
            this.routes[`${controller.path}${action.path}`][action.method] = {
                fn: controller.target.prototype[action.method],
                params: []
            };
            var params = _.filter(this.params, (param) => {
                return param.className === action.className && action.method === param.methodName;
            });
            _.forEach(params, (param) => {
                this.routes[`${controller.path}${action.path}`][action.method].params[param.order] = param.name;
            });

        });
    }

    MetadataStorage.prototype.matchRoute = function (route, method) {
        method = method.toLowerCase();
        var params = [];
        const keys = Object.keys(this.routes);
        var foundMatch = false;
        var i = 0;
        while (!foundMatch && i < keys.length) {
            var routeMatcher = new RegExp(keys[i].replace(/:[^\s/]+/g, '([\\w-]+)'));
            if (route.match(routeMatcher)) {
                var params = routeMatcher.exec(route);
                params = _.drop(params);
                match = this.routes[keys[i]][method];
                match.paramValues = params;
                foundMatch = true;
            }
            i++;
        }
        return match;
    }

    return MetadataStorage;
}());
exports.MetadataStorage = MetadataStorage;