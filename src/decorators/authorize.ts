import {getMetadataStorage} from '../index';
export function Authorize(roles?: Array<string>) {
    return function (object: Object, methodName: string) {
        getMetadataStorage().authorize.push({
            roles: roles,
            methodName: methodName,
            className: object.constructor.name,
        }) 
       
    }
}