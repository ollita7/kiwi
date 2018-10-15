import { MetadataStorage } from '../metadata/metadataStorage';

export function MiddlewareAfter(order?: number) {
    return function decorator(object: Object) {
        MetadataStorage.middlewaresAfter.push({
            target: object,
            order: order == undefined ? 0 : order
        })
    }
}