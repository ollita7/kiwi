import { MetadataStorage } from '../metadata/metadataStorage';
import 'reflect-metadata';
export function Post(path?: string): Function {
    return function (object: Object, methodName: string) {
        MetadataStorage.actions.push({
            path: path? path : '',
            method: 'post',
            methodName: methodName,
            className: object.constructor.name,
        })
    }
}