var kiwi = require("../index");
export function Authorize(roles: string[]) {
    return function (object: Object, methodName: string, descriptor: number) {
        kiwi.getMetadataStorage().authorize.push({
            roles: roles,
            methodName: methodName,
            className: object.constructor.name,
        }) 
       
    }
}