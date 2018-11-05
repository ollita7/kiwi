export interface IKiwiOptions{
    controllers?: Function[];
    authorization?: Function;
    middlewares?: Function[];
    log?: boolean;
    documentation?: IDocumentationOption;
    cors? : boolean;
    port: number;
    prefix?: string,
    socket?: boolean;
}

export interface IDocumentationOption {
    enabled: boolean;
    path?: string;
}
