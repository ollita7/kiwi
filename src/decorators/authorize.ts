import { MetadataStorage } from '../metadata/metadataStorage';
export function Authorize(roles?: Array<string>) {
    return function (object: Object, methodName: string) {
        MetadataStorage.authorize.push({
            roles: roles,
            methodName: methodName,
            className: object.constructor.name,
        }) 
       
    }
}