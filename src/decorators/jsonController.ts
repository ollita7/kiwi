import {getMetadataStorage} from '../index';
export function JsonController(path: string| RegExp) {
    return function decorator(object: Object) {
        getMetadataStorage().controllers.push({
            path: path,
            target: object,
        })
    }
  }