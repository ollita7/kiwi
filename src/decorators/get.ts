import {getMetadataStorage} from '../index';
export function Get(path: string | RegExp) {
    return function (object: Object, methodName: string) {
        getMetadataStorage().actions.push({
            path: path,
            method: 'get',
            methodName: methodName,
            className: object.constructor.name,
        })
       
    }
}