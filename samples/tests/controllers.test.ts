import { suite, test } from 'mocha-typescript';
import { assert } from 'chai';
import { IKiwiOptions, createKiwiServer, processRequest } from '../../src/index';
import { UserController } from '../user/user-controller';
import { SampleMiddleware } from '../middleware/sampleMiddleware';
import { KiwiMetadataStorage } from '../../src/metadata/metadataStorage';
var httpMocks = require('node-mocks-http');

const options: IKiwiOptions = {
  controllers: [UserController],
  authorization: null,
  middlewares: [SampleMiddleware],
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
};

@suite class UserControllersSuite {
  static before() {
    KiwiMetadataStorage.init(options);
  }

  before() {}

  @test async 'It must return 1'() {
    const body = {
      name: 'NewUser',
      lastname: 'NewUser',
      age: 33,
      address: [
        {
          street: 'user street',
          number: 2213
        }
      ]
    };
    var request = httpMocks.createRequest({
      method: 'POST',
      url: '/v1/usercontroller/create',
      headers: {
        'content-type': 'application/json'
      }
    });
    var response = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    setImmediate(() => request.send(JSON.stringify(body)));
    await processRequest(request, response);
    assert.equal(response.statusCode, 200);
    var data = JSON.parse(response._getData());
    assert.equal(data.name, body.name);
  }

  @test async 'It must return the param 1'() {
    const body = {
      name: 'UserModifyed',
      lastname: 'UserModifyed',
      age: 33,
      address: [
        {
          street: 'user street',
          number: 2213
        }
      ]
    };
    var request = httpMocks.createRequest({
      method: 'PUT',
      url: `/v1/usercontroller/update/`
    });

    var response = httpMocks.createResponse();
    await processRequest(request, response);
    var data = JSON.parse(response._getData());
    assert.equal(response.statusCode, 200);
    assert.equal(data.name, body.name);
  }

  // @test async 'It must return 404 http error'() {
  //   var request = httpMocks.createRequest({
  //     method: 'GET',
  //     url: '/v1/testcontroller/queryparadsdm/1'
  //   });

  //   var response = httpMocks.createResponse();
  //   await processRequest(request, response);
  //   var data = response._getData();
  //   assert.equal(response.statusCode, 404);
  //   assert.equal(data, 'Method doesnt match');
  // }

  @test async 'It must get'() {
    var request = httpMocks.createRequest({
      method: 'GET',
      url: '/v1/usercontroller/get/1'
    });

    var response = httpMocks.createResponse();
    await processRequest(request, response);
    var data = JSON.parse(response._getData());
    assert.equal(response.statusCode, 200);
    assert.equal(data.name, 'UserModifyed');
  }

  // @test async 'It must create an object with query params values as properies'() {
  //   var request = httpMocks.createRequest({
  //     method: 'GET',
  //     url: '/v1/usercontroller/queryparam/1?name=guille'
  //   });

  //   var response = httpMocks.createResponse();
  //   await processRequest(request, response);
  //   var data = JSON.parse(response._getData());
  //   assert.equal(response.statusCode, 200);
  //   assert.equal(data.name, 'guille');
  // }

  // @test async 'It must add two header params'() {
  //   const h1 = 'header1';
  //   const h2 = 'header2';
  //   var request = httpMocks.createRequest({
  //     method: 'GET',
  //     url: '/v1/testcontroller/testHeaders',
  //     headers: {
  //       h1: h1,
  //       h2: h2
  //     }
  //   });

  //   var response = httpMocks.createResponse();
  //   await processRequest(request, response);
  //   var data = JSON.parse(response._getData());
  //   assert.equal(response.statusCode, 200);
  //   assert.equal(data.h1, h1);
  //   assert.equal(data.h2, h2);
  // }

  // @test async 'It mus parse body'() {
  //   const body = { name: 'kiwi' };
  //   var request = httpMocks.createRequest({
  //     method: 'POST',
  //     url: '/v1/testcontroller/test123',
  //     headers: {
  //       'content-type': 'application/json'
  //     }
  //   });
  //   var response = httpMocks.createResponse({
  //     eventEmitter: require('events').EventEmitter
  //   });

  //   setImmediate(() => request.send(JSON.stringify(body)));
  //   await processRequest(request, response);
  //   var data = JSON.parse(response._getData());
  //   assert.equal(data.name, body.name);
  // }

  static after() {}

  after() {}
}
