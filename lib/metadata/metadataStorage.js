var _ = require('lodash');
var MetadataStorage = (function () {

    function MetadataStorage() {
        this.actions = [];
        this.controllers = [];
        this.routes = {};
        this.params = [];
        this.middlewares = [];
        this.interceptors = [];
    }

    MetadataStorage.prototype.getRoutes = function () {
        _.forEach(this.actions, (action) => {
            const controller = _.find(this.controllers, (controller) => {
                return action.className == controller.target.name;
            });
            if (_.isNil(this.routes[`${controller.path}${action.path}`])) {
                this.routes[`${controller.path}${action.path}`] = {};
            }

            this.routes[`${controller.path}${action.path}`][action.method] = {
                fn: controller.target.prototype[action.methodName],
                params: []
            };
            var params = _.filter(this.params, (param) => {
                return param.className === action.className && action.methodName === param.methodName;
            });
            _.forEach(params, (param) => {
                this.routes[`${controller.path}${action.path}`][action.method].params[param.order] = param.name;
            });

        });
    }

    MetadataStorage.prototype.matchRoute = function (route, method) {
        match = null;
        method = method.toLowerCase();
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
                match = this.routes[keys[i]][method];
                match.paramValues = params;
                foundMatch = true;
            }
            i++;
        }
        return match;
    }

    function getParamsByOrder(match) {

    }

    return MetadataStorage;
}());
exports.MetadataStorage = MetadataStorage;