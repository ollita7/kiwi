import { createKiwiServer, IKiwiOptions, AuthorizeResponse, getKiwiEmitter, ON_EXCEPTION, addKiwiListener } from '../src/index';
import * as http from 'http';
import { environment } from './environments/environment';
import { UserController } from './controllers/user/user-controller';
import { TestController } from './controllers/test-controller';
import { TestController2 } from './controllers/test-controller2';
import { TestController3 } from './controllers/test-controller3';
import { TestMiddleware } from './middlewares/test-middlware';
import { TestMiddleware2 } from './middlewares/test-middlware2';

async function validateAuthentication(request: http.IncomingMessage, roles: Array<string>): Promise<AuthorizeResponse | boolean> {
  console.log(roles);
  return true;
}

const options: IKiwiOptions = {
  controllers: [UserController, TestController, TestController2, TestController3],
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
const server = createKiwiServer(options);

const emitter = getKiwiEmitter();
emitter.on(ON_EXCEPTION, (ex: any) => {
  console.log(ex);
});

addKiwiListener('entre', (data:any) => {
  console.log(data)
})
