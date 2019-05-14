import { KiwiMetadataStorage } from '../metadata/metadataStorage';
export function HeaderParam(name: string) {
    return function (object: Object, methodName: string, descriptor: number) {
        KiwiMetadataStorage.params.unshift({
            order: descriptor,
            name: name,
            type: 'headerParam',
            methodName: methodName,
            className: object.constructor.name,
        })
       
    }
}