var kiwi = require("../index");
function Authorize(roles) {
    return function (object, methodName, descriptor) {
        kiwi.getMetadataStorage().authorize.push({
            roles: roles,
            methodName: methodName,
            className: object.constructor.name,
        }) 
       
    }
}
exports.Authorize = Authorize