import { createKiwiServer, IKiwiOptions, AuthorizeResponse } from '../src/index';
import { TestController3 } from './test/test-controller3';
import { TestMiddleware2 } from './test/test-middlware2';
import { TestMiddleware } from './test/test-middlware';
import * as http from 'http';
import { environment } from './environments/environment';
import { TestController2 } from './test/test-controller2';
import { TestController } from './test/test-controller';
import { UserController } from './UserRegistraton/user-controller';

async function validateAuthentication(request: http.IncomingMessage, roles: Array<string>): Promise<AuthorizeResponse | boolean> {
  console.log(roles);
  return true;
}

const options: IKiwiOptions = {
  controllers: [TestController, TestController2, TestController3, UserController],
  authorization: validateAuthentication,
  middlewares: [TestMiddleware2, TestMiddleware],
  cors: {
    enabled: true,
    domains: environment.domains
  },
  documentation: {
    enabled: true,
    path: '/apidoc'
  },
  log: true,
  port: 8086,
  prefix: '/v1'
};
const server = createKiwiServer(options, null);
