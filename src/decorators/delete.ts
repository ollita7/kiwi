import { KiwiMetadataStorage } from '../metadata/metadataStorage';
export function Delete(path: string | RegExp) {
    return function (object: Object, methodName: string) {
        KiwiMetadataStorage.actions.push({
            path: path? path : '',
            method: 'delete',
            methodName: methodName,
            className: object.constructor.name,
            contentType: 'application/json'
        })
    }
}