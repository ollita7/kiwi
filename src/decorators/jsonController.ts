import { KiwiMetadataStorage } from '../metadata/metadataStorage';
export function JsonController(path: string | RegExp) {
    return function decorator(object: Object) {
        KiwiMetadataStorage.controllers.push({
            path: path,
            target: object,
        })
    }
}