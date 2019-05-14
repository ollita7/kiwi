import { ValidateNested, IsString, IsNumber, IsArray } from 'class-validator'

export class AddressModel {
    @IsString() public street: string;
    @IsNumber() public number: number;
}

export class User {
    @IsString()  public name: string;
    @IsString()  public lastname: string;
    @IsNumber() public age: number;
    @ValidateNested({each: true}) public address: AddressModel[];
}

