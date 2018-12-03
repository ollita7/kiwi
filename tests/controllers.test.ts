import { suite, test } from "mocha-typescript";
import { assert } from 'chai';
import { IKiwiOptions, createKiwiServer, processRequest } from '../src/index';
import { TestController } from '../samples/test-controller';
import { TestController2 } from '../samples/test-controller2';
import { TestController3 } from '../samples/test-controller3';
import { TestMiddleware2 } from '../samples/test-middlware2';
import { TestMiddleware } from '../samples/test-middlware';
import { MetadataStorage } from '../src/metadata/metadataStorage';
var httpMocks = require('node-mocks-http');

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

@suite class ControllersSuite {
    static before() {
        MetadataStorage.init(options);
    }

    before() {

    }

    @test async 'It must return the param 1'() {
        const param = 'pepe';
        var request  = httpMocks.createRequest({
            method: 'GET',
            url: `/v1/testcontroller/testinguy/${param}`           
        });
    
        var response = httpMocks.createResponse();
        await processRequest(request, response);
        var data = JSON.parse(response._getData());
        assert.equal(response.statusCode , 200);
        assert.equal(data.name , param);
    }

    @test async 'It must return 404 http error'() {
        var request  = httpMocks.createRequest({
            method: 'GET',
            url: '/v1/testcontroller/queryparadsdm/1'           
        });
    
        var response = httpMocks.createResponse();
        await processRequest(request, response);
        var data = response._getData();
        assert.equal(response.statusCode , 404);
        assert.equal(data, 'Method doesnt match');
    }

    static after() {

    }

    after() {

    }
}