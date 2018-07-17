import { MetadataStorage } from '../metadata/metadataStorage';

export function Body() {
    return function (object: any, methodName: string, descriptor: number) {
        MetadataStorage.params.unshift({
            order: descriptor,
            name: 'body',
            type: 'body',
            methodName: methodName,
            className: object.constructor.name,
        })
    }
}