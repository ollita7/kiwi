var kiwi = require("../index");
function Body() {
    return function (object, methodName, descriptor) {
        kiwi.getMetadataStorage().params.push({
            order: descriptor,
            name: 'body',
            type: 'body',
            methodName: methodName,
            className: object.constructor.name,
        })
       
    }
}
exports.Body = Body