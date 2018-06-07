var index = require("../index");
function Post(path) {
    return function (object, methodName) {
        index.getMetadataStorage().actions.push({
            path: path,
            method: 'POST',
            methodName: methodName,
            className: object.constructor.name,
        })
    }
}
exports.Post = Post