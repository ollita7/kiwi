export interface IKiwiOptions{
    controllers?: Function[];
    authorization?: Function;
    middlewares?: Function[];
    log?: boolean;
    documentation?: IDocumentationOption;
    cors? : ICorsOption;
    port: number;
    prefix?: string,
    socket?: boolean;
}

export interface IDocumentationOption {
    enabled: boolean;
    path?: string;
}

export interface ICorsOption {
    enabled: boolean;
    domains?: Array<string>;
}
