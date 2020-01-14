import { createKiwiServer, IKiwiOptions, AuthorizeResponse } from '../src/index';
import { TestController2 } from './controllers/test-controller2';
import { TestController3 } from './controllers/test-controller3';
import { TestController } from './controllers/test-controller';
import { TestMiddleware } from './middlewares/test-middlware';
import { TestMiddleware2 } from './middlewares/test-middlware2';
import * as http from 'http';
import { environment } from './environments/environment';

async function validateAuthentication(request: http.IncomingMessage, roles: Array<string>): Promise<AuthorizeResponse | boolean> {
  console.log(roles);
  return true;
}

const options: IKiwiOptions = {
  controllers: [TestController, TestController2, TestController3],
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
