import { KiwiMetadataStorage } from '../metadata/metadataStorage';
export function Param(name: string) {
    return function (object: Object, methodName: string, descriptor: number) {
        KiwiMetadataStorage.params.unshift({
            order: descriptor,
            name: name,
            type: 'query',
            methodName: methodName,
            className: object.constructor.name,
        })
       
    }
}