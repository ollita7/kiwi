import { KiwiMetadataStorage } from '../metadata/metadataStorage';
export function Post(path?: string): Function {
    return function (object: Object, methodName: string) {
        KiwiMetadataStorage.actions.push({
            path: path? path : '',
            method: 'post',
            methodName: methodName,
            className: object.constructor.name,
        })
    }
}