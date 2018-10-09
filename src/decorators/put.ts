import { MetadataStorage } from '../metadata/metadataStorage';
export function Put(path: string | RegExp) {
    return function (object: Object, methodName: string) {
        MetadataStorage.actions.push({
            path: path? path : '',
            method: 'put',
            methodName: methodName,
            className: object.constructor.name,
        })
    }
}