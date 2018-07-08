import { MetadataStorage } from '../metadata/metadataStorage';
export function Get(path: string | RegExp) {
    return function (object: Object, methodName: string) {
        MetadataStorage.actions.push({
            path: path,
            method: 'get',
            methodName: methodName,
            className: object.constructor.name,
        })
       
    }
}