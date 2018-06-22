import { createKiwiServer } from '../src/index';
import { TestController } from './test-controller';
import { TestController2 } from './test-controller2';


function validateAuthentication(roles: Array<string>){
    console.log(roles);
    return true;
}

const options = {
    controllers: [TestController, TestController2],
    authorization: validateAuthentication
}
const server = createKiwiServer(options);
server.listen(8086);