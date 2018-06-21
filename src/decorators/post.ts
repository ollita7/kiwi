var index = require("../index");
export function Post(path: string): Function {
    return function (object: Object, methodName: string) {
        index.getMetadataStorage().actions.push({
            path: path,
            method: 'post',
            methodName: methodName,
            className: object.constructor.name,
        })
    }
}