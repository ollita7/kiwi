import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { KiwiMetadataStorage } from '../metadata/metadataStorage';

export function IsArray(typeFunction?: () => Function): any {
   return function(object: Object, propertyName: string) {
     ValidateNested({ each: true })(object, propertyName);
     Type(typeFunction)(object, propertyName);
   };
}
