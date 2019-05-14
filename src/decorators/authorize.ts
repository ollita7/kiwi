import { KiwiMetadataStorage } from '../metadata/metadataStorage';
import { isNil } from 'lodash';

export function Authorize(roles?: Array<string>) {
    return function (object: Function|Object, methodName?: string) {
        const className = !isNil(methodName) ? object.constructor : object as Function;
        KiwiMetadataStorage.authorize.push({
            roles: roles,
            methodName: methodName,
            className: className.name,
        }) 
       
    }
}
