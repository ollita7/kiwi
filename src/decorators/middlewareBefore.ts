import { MetadataStorage } from '../metadata/metadataStorage';

export function MiddlewareBefore() {
    return function decorator(object: Object) {
        MetadataStorage.middlewaresBefore.push({
            target: object
        })
    }
  }