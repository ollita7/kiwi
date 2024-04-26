export interface IAuthorize{
    roles: string[];
    methodName: string;
    className: string;
}

export interface IAction{
    path: string | RegExp;
    method: string;
    className: string;
    methodName: string;
    contentType: string;
}

export interface IParam{
    order: number,
    name: string,
    type: string,
    methodName: string,
    className: string,
    object: any;
}

export interface IActionExecutor {
    fn: Function;
    executor: any;
    params: IParam[];
    paramValues?: any[];
    authorize: boolean;
    roles: string[];
    contentType: string;
}

export interface IRoutes{
    [key: string]: IActionExecutor;
}

export interface IRouter {
    [key: string]: IRoutes;
}

export enum MiddlewareType {
    Before = 'before',
    After = 'after',
}

export interface IMiddleware {
    target: any,
    order?: number
}
