import {getMetadataStorage} from '../index';
export function Authorize(roles: string[]) {
    return function (object: Object, methodName: string, descriptor: number) {
        getMetadataStorage().authorize.push({
            roles: roles,
            methodName: methodName,
            className: object.constructor.name,
        }) 
       
    }
}