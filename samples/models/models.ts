import { Model } from "../../src/decorators/model";

@Model()
export class User {
    public name: string;
    public lastname: string;
    public age: number;
    public address: Array<Address>;
}

@Model()
export class Address{
    public street: string;
    public number: number;
}