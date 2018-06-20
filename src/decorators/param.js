var kiwi = require("../index");
function Param(name) {
    return function (object, methodName, descriptor) {
        kiwi.getMetadataStorage().params.push({
            order: descriptor,
            name: name,
            type: 'query',
            methodName: methodName,
            className: object.constructor.name,
        })
       
    }
}
exports.Param = Param