import { createKiwiServer } from '../lib/index';
import { TestController } from './test-controller';
import { TestController2 } from './test-controller2';

const options = {
    controllers: [TestController, TestController2]
}
const server = createKiwiServer(options);
server.listen(8086);