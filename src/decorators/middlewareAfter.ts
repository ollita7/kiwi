import {getMetadataStorage} from '../index';

export function MiddlewareAfter() {
    return function decorator(object: Object) {
        getMetadataStorage().middlewaresBefore.push({
            target: object
        })
    }
  }