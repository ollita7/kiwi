import {getMetadataStorage} from '../index';

export function MiddlewareBefore() {
    return function decorator(object: Object) {
        getMetadataStorage().middlewaresBefore.push({
            target: object
        })
    }
  }