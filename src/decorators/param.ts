import {getMetadataStorage} from '../index';
export function Param(name: string) {
    return function (object: Object, methodName: string, descriptor: number) {
        getMetadataStorage().params.unshift({
            order: descriptor,
            name: name,
            type: 'query',
            methodName: methodName,
            className: object.constructor.name,
        })
       
    }
}