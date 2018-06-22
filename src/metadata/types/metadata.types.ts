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
}

export interface IParam{
    order: number,
    name: string,
    type: string,
    methodName: string,
    className: string,
}

export interface IActionExecutor {
    fn: Function;
    params: IParam[];
    paramValues?: string[];
    authorize: boolean;
    roles: string[];
}

export interface IRoutes{
    [key: string]: IActionExecutor;
}

export interface IRouter {
    [key: string]: IRoutes;
}
