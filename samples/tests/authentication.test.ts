import { suite, test } from "mocha-typescript";
import { assert } from 'chai';
import { IKiwiOptions, createKiwiServer, processRequest } from '../../src/index';
import { UserController } from '../controllers/user/user-controller';
import { KiwiMetadataStorage } from '../../src/metadata/metadataStorage';
import * as http from 'http';
var sinon = require('sinon');
var httpMocks = require('node-mocks-http');

var callback = sinon.spy();

var options: IKiwiOptions = {
    controllers: [UserController],
    authorization: function(request: http.IncomingMessage, roles: Array<string>){
        callback();
        return true;
    },
    middlewares: [],
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

@suite class AuthenticationSuite {
    static before() {
        KiwiMetadataStorage.init(options);
    }

    before() {
    }

    static after() {

    }

    after() {

    }
}