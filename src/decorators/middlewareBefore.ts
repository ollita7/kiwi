import { MetadataStorage } from '../metadata/metadataStorage';

export function MiddlewareBefore(order?: number) {
    return function decorator(object: Object) {
        MetadataStorage.middlewaresBefore.push({
            target: object,
            order: order == undefined? 0 : order
        })
    }
  }