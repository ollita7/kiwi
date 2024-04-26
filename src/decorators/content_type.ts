import { KiwiMetadataStorage } from '../metadata/metadataStorage';
export function ContentType(content_type: string) {
    return function (object: Object, methodName: string) {
        const index = KiwiMetadataStorage.actions.findIndex(a => a.className == object.constructor.name && a.methodName == methodName);
        KiwiMetadataStorage.actions[index].contentType = content_type;
    }
}