import * as http from 'http';
export interface IMiddleware {
    execute(request: http.IncomingMessage, response: http.ServerResponse): any;
}