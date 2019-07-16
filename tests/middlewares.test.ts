import { suite, test } from "mocha-typescript";
import { assert } from 'chai';
import { CorsMiddleware } from '../src/middlewares/corsMiddlware';
import { LogMiddleware } from '../src/middlewares/logMiddlware';
import { DocMiddleware } from '../src/middlewares/docMiddleware';
var httpMocks = require('node-mocks-http');
var sinon = require('sinon');


@suite class MIddlewaresSuite {
  static before() {
    (global as any).options = {
      cors: { domains: ['test'] },
      prefix: '/v1',
      documentation: {
        path: "/apidoc"
      }
    };
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
    var next = sinon.spy();
    corsMiddleware.execute(request, response, next);
    assert.isTrue(next.calledOnce);
  }

  @test 'It must execute log middleware'() {
    const middleware = new LogMiddleware();
    const param = 'pepe';
    var request = httpMocks.createRequest({
      method: 'POST',
      url: `/v1/testcontroller/testinguy/${param}`
    });
    var response = httpMocks.createResponse();
    response.getHeaders = function () {
      return {};
    };
    var next = sinon.spy();
    middleware.execute(request, response, next);
    assert.isTrue(next.calledOnce);
  }

  @test 'It must execute doc middleware for post'() {
    const middleware = new DocMiddleware();
    var request = httpMocks.createRequest({
      method: 'POST',
      url: `/v1/apidoc`
    });
    var response = httpMocks.createResponse();
    var next = sinon.spy();
    middleware.execute(request, response, next);
    assert.equal(response.statusCode, 200);
  }

  static after() {

  }

  after() {

  }
}
