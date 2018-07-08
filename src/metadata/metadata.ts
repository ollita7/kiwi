import { IAuthorize, IAction, IRouter, IMiddleware } from './types/metadata.types';
export class Metadata {
    public actions: IAction[]
    public controllers: any[];
    public params: any[];
    public middlewaresBefore: IMiddleware[];
    public middlewaresAfter: IMiddleware[];
    public interceptors: any[];
    public authorize: IAuthorize[];
    public routes: IRouter = {};

    constructor(){
        this.actions = [];
        this.controllers = [];
        this.authorize = [];
        this.interceptors = [];
        this.middlewaresAfter = [];
        this.middlewaresBefore = [];
        this.params = [];
    }
}
    