var index = require("../index");
function Post(path) {
    return function (object, methodName) {
        index.getMetadataStorage().actions.push({
            path: path,
            method: 'post',
            methodName: methodName,
            className: object.constructor.name,
        })
    }
}
exports.Post = Post