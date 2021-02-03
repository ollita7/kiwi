import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export function IsObject(typeFunction?: () => Function): any {
   return function(object: Object, propertyName: string) {
     ValidateNested()(object, propertyName);
     Type(typeFunction)(object, propertyName);
   };
}