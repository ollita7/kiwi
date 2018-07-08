import { MetadataStorage } from '../metadata/metadataStorage';
export function Put(path: string | RegExp) {
    return function (object: Object, methodName: string) {
        console.log(`${object}`);
    }
}