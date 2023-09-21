import { isNil } from 'lodash';

export interface IKiwiOptions {
  controllers?: Function[];
  authorization?: Function;
  middlewares?: Function[];
  log?: boolean;
  documentation?: IDocumentationOption;
  cors?: ICorsOption;
  port: number;
  prefix?: string;
  socket?: ISocketOption;
}

export interface ISocketOption {
  enabled: boolean;
  path?: string;
  cors?: string[];
}

export interface IDocumentationOption {
  enabled: boolean;
  path?: string;
  suffix?: string;
}

export interface ICorsOption {
  enabled: boolean;
  domains?: Array<string>;
}

export class AuthorizeResponse {
  result: boolean | number;
  message: string;
  constructor(result?: boolean | number, message?: string) {
      this.result = isNil(result)? true: result;
      this.message = isNil(message)? 'Not authorized': message;
  }
}
