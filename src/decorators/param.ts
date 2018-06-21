var kiwi = require("../index");
export function Param(name: string) {
    return function (object: Object, methodName: string, descriptor: number) {
        kiwi.getMetadataStorage().params.push({
            order: descriptor,
            name: name,
            type: 'query',
            methodName: methodName,
            className: object.constructor.name,
        })
       
    }
}