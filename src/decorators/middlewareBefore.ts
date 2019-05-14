import { KiwiMetadataStorage } from '../metadata/metadataStorage';

export function MiddlewareBefore(order?: number) {
    return function decorator(object: Object) {
        KiwiMetadataStorage.middlewaresBefore.push({
            target: object,
            order: order == undefined? 0 : order
        })
    }
  }