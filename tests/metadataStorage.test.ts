import { suite, test } from "mocha-typescript";
import { assert } from 'chai';
import { IKiwiOptions } from '../src/index';
import { TestController } from '../samples/test-controller';
import { TestController2 } from '../samples/test-controller2';
import { TestController3 } from '../samples/test-controller3';
import { TestMiddleware2 } from '../samples/test-middlware2';
import { TestMiddleware } from '../samples/test-middlware';
import { KiwiMetadataStorage } from '../src/metadata/MetadataStorage';

const options: IKiwiOptions = {
    controllers: [TestController, TestController2, TestController3],
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

/*
describe("Metadata storage test", () => {
    it("it must create metadata for server", () => {
        KiwiMetadataStorage.init(options);
        assert.equal(9, Object.keys(KiwiMetadataStorage.routes).length);
    });

    it("it must match route", () => {
        KiwiMetadataStorage.init(options);
        const match = KiwiMetadataStorage.matchRoute('/v1/testcontroller/queryparam/1', 'get');
        assert.isNotNull(match);
    });
});
*/

@suite class KiwiMetadataStorageSuite {
    static before() {
        KiwiMetadataStorage.init(options);
    }

    before() {

    }

    @test 'It must exist 10 routes'() {
        assert.equal(10, Object.keys(KiwiMetadataStorage.routes).length);
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