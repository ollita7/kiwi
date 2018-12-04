import { suite, test } from "mocha-typescript";
import { assert } from 'chai';
import { IKiwiOptions, createKiwiServer, processRequest } from '../src/index';
import { TestController } from '../samples/test-controller';
import { TestController2 } from '../samples/test-controller2';
import { TestController3 } from '../samples/test-controller3';
import { TestMiddleware2 } from '../samples/test-middlware2';
import { TestMiddleware } from '../samples/test-middlware';
import { MetadataStorage } from '../src/metadata/metadataStorage';
import * as http from 'http';
var sinon = require('sinon');
var httpMocks = require('node-mocks-http');

var callback = sinon.spy();

var options: IKiwiOptions = {
    controllers: [TestController, TestController2, TestController3],
    authorization: function(request: http.IncomingMessage, roles: Array<string>){
        console.log(roles);
        callback();
        return true;
    },
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

@suite class AuthenticationSuite {
    static before() {
        MetadataStorage.init(options);
    }

    before() {
    }

    @test async 'It must call validateAuthentication method'() {
        var request = httpMocks.createRequest({
            method: 'GET',
            url: `/v1/testcontroller2/getAction`
        });

        var response = httpMocks.createResponse();
        await processRequest(request, response);
        assert.equal(response.statusCode, 200);
        assert.isTrue(callback.calledOnce);
    }

    static after() {

    }

    after() {

    }
}