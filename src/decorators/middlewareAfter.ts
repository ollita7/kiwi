import { MetadataStorage } from '../metadata/metadataStorage';

export function MiddlewaresAfter(order?: number) {
    return function decorator(object: Object) {
        MetadataStorage.middlewaresAfter.push({
            target: object,
            order: order == undefined ? 0 : order
        })
    }
}