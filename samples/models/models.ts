import { IsString, IsNumber, IsObject } from '../../src/index'

export class AddressModel {
    @IsString() public street: string;
    @IsNumber() public number: number;
}

export class UserModel {
    @IsNumber() public id: number;
    @IsString()  public name: string;
    @IsString()  public lastname: string;
    @IsNumber() public age: number;
    @IsObject(() => AddressModel) public address: AddressModel;
    //@Isay(() => AddressModel) public address: AddressModel[];
}
