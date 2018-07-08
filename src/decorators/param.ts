import { MetadataStorage } from '../metadata/metadataStorage';
export function Param(name: string) {
    return function (object: Object, methodName: string, descriptor: number) {
        MetadataStorage.params.unshift({
            order: descriptor,
            name: name,
            type: 'query',
            methodName: methodName,
            className: object.constructor.name,
        })
       
    }
}