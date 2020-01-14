import { suite, test } from "mocha-typescript";
import { assert } from 'chai';
import { IKiwiOptions, createKiwiServer, processRequest } from '../../src/index';
import { TestController } from '../controllers/test-controller';
import { TestController2 } from '../controllers/test-controller2';
import { TestController3 } from '../controllers/test-controller3';
import { TestMiddleware2 } from '../controllers/test-middlware2';
import { TestMiddleware } from '../controllers/test-middlware';
import { KiwiMetadataStorage } from '../../src/metadata/metadataStorage';
var httpMocks = require('node-mocks-http');

const options: IKiwiOptions = {
  controllers: [TestController, TestController2, TestController3],
  authorization: null,
  middlewares: [TestMiddleware2, TestMiddleware],
  cors: {
    enabled: true,
    domains: ['localhost:8086']
  },
  documentation: {
    enabled: true,
    path: '/apidoc'
  },
  log: true,
  port: 8086,
  prefix: '/v1'
}

@suite class ControllersSuite {
  static before() {
    KiwiMetadataStorage.init(options);
  }

  before() {

  }

  @test async 'It must return the param 1'() {
    const param = 'pepe';
    var request = httpMocks.createRequest({
      method: 'GET',
      url: `/v1/testcontroller/testinguy/${param}`
    });

    var response = httpMocks.createResponse();
    await processRequest(request, response);
    var data = JSON.parse(response._getData());
    assert.equal(response.statusCode, 200);
    assert.equal(data.name, param);
  }

  @test async 'It must return 404 http error'() {
    var request = httpMocks.createRequest({
      method: 'GET',
      url: '/v1/testcontroller/queryparadsdm/1'
    });

    var response = httpMocks.createResponse();
    await processRequest(request, response);
    var data = response._getData();
    assert.equal(response.statusCode, 404);
    assert.equal(data, 'Method doesnt match');
  }

  @test async 'It must create an object with query params values as properies'() {
    var request = httpMocks.createRequest({
      method: 'GET',
      url: '/v1/testcontroller/queryparam/1?name=guille'
    });

    var response = httpMocks.createResponse();
    await processRequest(request, response);
    var data = JSON.parse(response._getData());
    assert.equal(response.statusCode, 200);
    assert.equal(data.name, 'guille');
  }

  @test async 'It must add two header params'() {
    const h1 = 'header1';
    const h2 = 'header2';
    var request = httpMocks.createRequest({
      method: 'GET',
      url: '/v1/testcontroller/testHeaders',
      headers: {
        h1: h1,
        h2: h2
      }
    });

    var response = httpMocks.createResponse();
    await processRequest(request, response);
    var data = JSON.parse(response._getData());
    assert.equal(response.statusCode, 200);
    assert.equal(data.h1, h1);
    assert.equal(data.h2, h2);
  }

  @test async 'It mus parse body'() {
    const body = { name: 'kiwi' };
    var request = httpMocks.createRequest({
      method: 'POST',
      url: '/v1/testcontroller/test123',
      headers:{
        "content-type": "application/json"
      }
    });
    var response = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    setImmediate(() => request.send(JSON.stringify(body)));
    await processRequest(request, response);
    var data = JSON.parse(response._getData());
    assert.equal(data.name, body.name);
  }

  static after() {

  }

  after() {

  }
}
