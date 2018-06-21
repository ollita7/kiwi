import {getMetadataStorage} from '../index';
export function Put(path: string | RegExp) {
    return function (object: Object, methodName: string) {
        console.log(`${object}`);
    }
}