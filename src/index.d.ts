import { KiwiOptions } from './types/kiwiOptions'; 
import { MetadataStorage } from './metadata/metadataStorage';
export * from "./decorators/Get";
export * from "./decorators/Post";
export * from "./decorators/Put";
export * from "./decorators/Delete";
export * from "./types/KiwiOptions";
export * from "./decorators/jsonController";
export * from "./decorators/param";
export * from "./decorators/body";
export * from "./decorators/authorize";

export declare function createKiwiServer(options?: KiwiOptions): any;
