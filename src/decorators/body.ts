import { KiwiMetadataStorage } from '../metadata/metadataStorage';

export function Body() {
    return function (object: any, methodName: string, descriptor: number) {
        KiwiMetadataStorage.params.unshift({
            order: descriptor,
            name: 'body',
            type: 'body',
            methodName: methodName,
            className: object.constructor.name,
            object: object
        })
    }
}