import { createKiwiServer, IKiwiOptions } from '../src/index';
import { TestController } from './test-controller';
import { TestController2 } from './test-controller2';
//import { TestController3 } from './test-controller3';
import { TestMiddleware2 } from './test-middlware2';
import { TestMiddleware } from './test-middlware';
//import {User, Address} from './models/models';

function validateAuthentication(roles: Array<string>){
    console.log(roles);
    return true;
}

const options: IKiwiOptions = {
    controllers: [TestController, TestController2/*, TestController3*/],
    authorization: validateAuthentication,
    middlewares: [TestMiddleware, TestMiddleware2],
    cors: true,
    documentation: true,
    log: true,
    port: 8086
}
const server = createKiwiServer(options);
