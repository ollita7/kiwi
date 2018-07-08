export interface IKiwiOptions{
    controllers?: Function[];
    authorization?: Function;
    middlewares?: Function[];
    log?: boolean;
    documentation?: boolean;
    cors? : boolean;
    port: number;
}

