import { suite, test } from 'mocha-typescript';
import { assert } from 'chai';
import { IKiwiOptions } from '../../src/index';
import { UserController } from '../user/user-controller';
import { SampleMiddleware } from '../middleware/sampleMiddleware';
import { KiwiMetadataStorage } from '../../src/metadata/metadataStorage';

const options: IKiwiOptions = {
  controllers: [UserController],
  authorization: null,
  middlewares: [SampleMiddleware],
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
};

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

@suite
class KiwiMetadataStorageSuite {
  static before() {
    KiwiMetadataStorage.init(options);
  }

  before() {}

  @test 'It must exist 11 routes'() {
    assert.equal(11, Object.keys(KiwiMetadataStorage.routes).length);
  }

  @test 'it must match route'() {
    const match = KiwiMetadataStorage.matchRoute('/v1/testcontroller/queryparam/1', 'get');
    assert.isNotNull(match);
  }

  @test 'it doesn`t must match route'() {
    const match = KiwiMetadataStorage.matchRoute('/v1/testcontroller/queryparam/1/2', 'get');
    assert.isNull(match);
  }

  @test 'it must exist one middleware after'() {
    assert.equal(1, KiwiMetadataStorage.middlewaresAfter.length);
  }

  @test 'it must exist one middleware before'() {
    assert.equal(1, KiwiMetadataStorage.middlewaresBefore.length);
  }

  static after() {}

  after() {}
}
