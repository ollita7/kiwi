import { MetadataStorage } from '../metadata/metadataStorage';
import { isNil } from 'lodash';

export function Authorize(roles?: Array<string>) {
    return function (object: Function|Object, methodName?: string) {
        const className = !isNil(methodName) ? object.constructor : object as Function;
        MetadataStorage.authorize.push({
            roles: roles,
            methodName: methodName,
            className: className.name,
        }) 
       
    }
}
