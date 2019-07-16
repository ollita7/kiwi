import { suite, test } from "mocha-typescript";
import { assert } from 'chai';
import { CorsMiddleware } from '../src/middlewares/corsMiddlware';
var httpMocks = require('node-mocks-http');
var sinon = require('sinon');

var next = sinon.spy();

@suite class MIddlewaresSuite {
  static before() {
    (global as any).options = { cors: { domains: ['test'] } };
  }

  before() {

  }

  @test 'It must execute cors middleware for options'() {
    const corsMiddleware = new CorsMiddleware();
    const param = 'pepe';
    var request = httpMocks.createRequest({
      method: 'OPTIONS',
      url: `/v1/testcontroller/testinguy/${param}`
    });
    var response = httpMocks.createResponse();
    response.getHeaders = function () {
      return {};
    };
    corsMiddleware.execute(request, response, null);
    assert.equal(response.statusCode, 204);
  }

  @test 'It must execute cors middleware for post'() {
    const corsMiddleware = new CorsMiddleware();
    const param = 'pepe';
    var request = httpMocks.createRequest({
      method: 'POST',
      url: `/v1/testcontroller/testinguy/${param}`
    });
    var response = httpMocks.createResponse();
    response.getHeaders = function () {
      return {};
    };
    corsMiddleware.execute(request, response, next);
    assert.isTrue(next.calledOnce);
  }



  static after() {

  }

  after() {

  }
}
