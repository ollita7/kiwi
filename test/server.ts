import { createKiwiServer } from '../lib/index';
import { TestController } from './test-controller';

const options = {
    controllers: [TestController]
}
const server = createKiwiServer(options);
server.listen(8086);