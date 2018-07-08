import { MetadataStorage } from '../metadata/metadataStorage';
export function JsonController(path: string| RegExp) {
    return function decorator(object: Object) {
        MetadataStorage.controllers.push({
            path: path,
            target: object,
        })
    }
  }