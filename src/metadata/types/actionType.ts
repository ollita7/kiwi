export interface ActionType{
    path: string | RegExp;
    method: string;
    target: Function;
}