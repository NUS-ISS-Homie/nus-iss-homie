import { expect } from 'chai';
import chaiHttp from 'chai-http';
import io from 'socket.io-client';
import app from '../index.js';
import { DEV_SERVER_URI } from '../constants.js';
import mongoose from 'mongoose';
import 'dotenv/config';
import assert from 'assert';

assert(process.env.ENV == 'TEST');

const SOCKET_OPTIONS = {
    transports: ['websocket'],
    'force new connection': true,
};

let user1, user2, user3;

describe('Socket connection', function () {
    before('Connect to MongoDB', function (done) {
        mongoose.connect(process.env.DB_CLOUD_URI_TEST).then(function () {
            done();
        });
    });

    it('should connect user1', function (done) {
        user1 = io.connect(DEV_SERVER_URI, SOCKET_OPTIONS);
        user1.on('connect', done);
    });

    it('should connect user2', function (done) {
        user2 = io.connect(DEV_SERVER_URI, SOCKET_OPTIONS);
        user2.on('connect', done);
    });

    it('should connect user3', function (done) {
        user3 = io.connect(DEV_SERVER_URI, SOCKET_OPTIONS);
        user3.on('connect', done);
    });
});

describe('Socket disconnect', function () {
    it('should disconnect user1', function (done) {
        user1.on('disconnect', () => done());
        user1.disconnect();
    });

    it('should disconnect user2', function (done) {
        user2.on('disconnect', () => done());
        user2.disconnect();
    });

    it('should disconnect user3', function (done) {
        user3.on('disconnect', () => done());
        user3.disconnect();
    });
});
