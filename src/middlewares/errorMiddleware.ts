import * as http from 'http';
export interface IErrorMiddleware {
    execute(error: any, request: http.IncomingMessage, response: http.ServerResponse, next: any): any;
}