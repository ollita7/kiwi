import { createKiwiServer, IKiwiOptions, AuthorizeResponse } from '../src/index';
import * as http from 'http';
import { environment } from './environments/environment';
import { UserController } from './user/user-controller';
import { SampleMiddleware } from './middleware/sampleMiddleware';

async function validateAuthentication(request: http.IncomingMessage, roles: Array<string>): Promise<AuthorizeResponse | boolean> {
  console.log(roles);
  return true;
}

const options: IKiwiOptions = {
  controllers: [UserController],
  authorization: validateAuthentication,
  middlewares: [SampleMiddleware],
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
