import { MetadataStorage } from '../metadata/metadataStorage';

export function MiddlewareAfter() {
    return function decorator(object: Object) {
        MetadataStorage.middlewaresBefore.push({
            target: object
        })
    }
  }