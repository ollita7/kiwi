import { suite, test } from "mocha-typescript";
import { assert } from 'chai';
import { IKiwiOptions } from '../../src/index';
import { TestController } from '../controllers/test-controller';
import { TestController2 } from '../controllers/test-controller2';
import { TestController3 } from '../controllers/test-controller3';
import { UserController } from "../controllers/user/user-controller";
import { TestMiddleware2 } from '../middlewares/test-middlware2';
import { TestMiddleware } from '../middlewares/test-middlware';
import { KiwiMetadataStorage } from '../../src/metadata/metadataStorage';

const options: IKiwiOptions = {
    controllers: [UserController, TestController, TestController2, TestController3],
    authorization: null,
    middlewares: [TestMiddleware2, TestMiddleware],
    cors: {
        enabled: true
    },
    documentation: {
        enabled: true,
        path: '/apidoc'
    },
    log: true,
    port: 8086,
    prefix: '/v1'
}

@suite class KiwiMetadataStorageSuite {
    static before() {
        KiwiMetadataStorage.init(options);
    }

    before() {

    }

    @test 'It must exist 17 routes'() {
        assert.equal(17, Object.keys(KiwiMetadataStorage.routes).length);
    }

    @test 'it must match route'() {
        const match = KiwiMetadataStorage.matchRoute('/v1/testcontroller/queryparam/1', 'get');
        assert.isNotNull(match);
    }

    @test 'it doesn`t must match route'() {
        const match = KiwiMetadataStorage.matchRoute('/v1/testcontroller/queryparam/1/2', 'get');
        assert.isNull(match);
    }

    @test 'it must exist one middleware after'(){
        assert.equal(1, KiwiMetadataStorage.middlewaresAfter.length);
    }

    @test 'it must exist one middleware before'(){
        assert.equal(1, KiwiMetadataStorage.middlewaresBefore.length);
    }

    static after() {

    }

    after() {

    }
}
