import { ActionType } from './types/actionType';
export class MetadataStorage{
    public actions: ActionType[];
    public controllers: any[];
    public params: any[];
    public middlewares: any[];
    public interceptors: any[];
    public authorize: any[];
}