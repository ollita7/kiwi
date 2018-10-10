import { createKiwiServer, IKiwiOptions } from '../src/index';
import { TestController } from './test-controller';
import { TestController2 } from './test-controller2';
import { TestController3 } from './test-controller3';
import { TestMiddleware2 } from './test-middlware2';
import { TestMiddleware } from './test-middlware';
import * as http from 'http';

function validateAuthentication(request: http.IncomingMessage, roles: Array<string>){
    console.log(roles);
    return true;
}

const options: IKiwiOptions = {
    controllers: [TestController, TestController2, TestController3],
    authorization: validateAuthentication,
    middlewares: [TestMiddleware2, TestMiddleware],
    cors: true,
    documentation: {
        enabled: true,
        path: '/apidoc'
    },
    log: true,
    port: 8086,
    prefix: '/v1'
}
const server = createKiwiServer(options);
