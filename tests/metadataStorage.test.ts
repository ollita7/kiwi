import { suite, test, slow, timeout } from "mocha-typescript";
import { IKiwiOptions } from '../src/index';
import { TestController } from '../samples/test-controller';
import { TestController2 } from '../samples/test-controller2';
import { TestController3 } from '../samples/test-controller3';
import { TestMiddleware2 } from '../samples/test-middlware2';
import { TestMiddleware } from '../samples/test-middlware';
import { MetadataStorage } from '../src/metadata/metadataStorage';
import { assert } from 'chai';

const options: IKiwiOptions = {
    controllers: [TestController, TestController2, TestController3],
    authorization: null,
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

/*
describe("Metadata storage test", () => {
    it("it must create metadata for server", () => {
        MetadataStorage.init(options);
        assert.equal(9, Object.keys(MetadataStorage.routes).length);
    });

    it("it must match route", () => {
        MetadataStorage.init(options);
        const match = MetadataStorage.matchRoute('/v1/testcontroller/queryparam/1', 'get');
        assert.isNotNull(match);
    });
});
*/

@suite class MetadataStorageSuite {
    static before() {
        MetadataStorage.init(options);
    }

    before() {

    }

    @test 'it must create metadata for server'() {
        assert.equal(9, Object.keys(MetadataStorage.routes).length);
    }

    @test 'it must match route'() {
        const match = MetadataStorage.matchRoute('/v1/testcontroller/queryparam/1', 'get');
        assert.isNotNull(match);
    }

    @test 'it doesn`t must match route'() {
        const match = MetadataStorage.matchRoute('/v1/testcontroller/queryparam/1/2', 'get');
        assert.isNull(match);
    }

    static after() {

    }

    after() {

    }
}