import {getMetadataStorage} from '../index';
export function Body() {
    return function (object: Object, methodName: string, descriptor: number) {
        getMetadataStorage().params.unshift({
            order: descriptor,
            name: 'body',
            type: 'body',
            methodName: methodName,
            className: object.constructor.name,
        })
    }
}