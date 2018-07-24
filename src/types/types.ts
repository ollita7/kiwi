export interface IKiwiOptions{
    controllers?: Function[];
    authorization?: Function;
    middlewares?: Function[];
    log?: boolean;
    documentation?: IDocumentationOption;
    cors? : boolean;
    port: number;
}

export interface IDocumentationOption {
    enabled: boolean;
    path?: string;
}
