import { KiwiMetadataStorage } from '../metadata/metadataStorage';

export function Context(name: string) {
    return function (object: any, methodName: string, descriptor: number) {
        KiwiMetadataStorage.params.unshift({
            order: descriptor,
            name: name,
            type: 'context',
            methodName: methodName,
            className: object.constructor.name,
            object: object
        })
    }
}