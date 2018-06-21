import {getMetadataStorage} from '../index';
export function Post(path: string): Function {
    return function (object: Object, methodName: string) {
        getMetadataStorage().actions.push({
            path: path,
            method: 'post',
            methodName: methodName,
            className: object.constructor.name,
        })
    }
}