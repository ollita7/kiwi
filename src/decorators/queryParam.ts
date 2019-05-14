import { KiwiMetadataStorage } from '../metadata/metadataStorage';
export function QueryParam() {
    return function (object: Object, methodName: string, descriptor: number) {
        KiwiMetadataStorage.params.unshift({
            order: descriptor,
            name: 'queryParam',
            type: 'queryParam',
            methodName: methodName,
            className: object.constructor.name,
        })
       
    }
}