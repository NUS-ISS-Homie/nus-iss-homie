import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
import io from 'socket.io-client';
import app from '../index.js';
import { DEV_SERVER_URI } from '../constants.js';
import mongoose from 'mongoose';
import 'dotenv/config';
import assert from 'assert';
import * as msg from '../common/messages.js';
import { entity } from '../controllers/home-controller.js';

assert(process.env.ENV == 'TEST');
chai.use(chaiHttp);
chai.use(chaiShallowDeepEqual);

// Socket

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

// CRUD

describe('MongoDB Connection', () => {
  it('Connect to MongoDB', async function () {
    mongoose.connect(process.env.DB_CLOUD_URI_TEST);
  });
});

let adminUserId = new mongoose.Types.ObjectId();
let userId1 = new mongoose.Types.ObjectId();
let homeId;

describe('Admin user creates a new home', () => {
  it('should create a new home', function (done) {
    const expectedBody = {
      message: msg.SUCCESS_CREATE(entity),
    };

    chai
      .request(app)
      .post(`/api/home/create`)
      .send({ adminUser: adminUserId })
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(msg.STATUS_CODE_CREATED);
        chai.expect(res.body).to.shallowDeepEqual(expectedBody);
        homeId = res.body.home._id;
        done();
      });
  });
});

describe('User joins then leaves an existing home', () => {
  it('should join an existing home', function (done) {
    const expectedBody = {
      home: {
        users: userId1,
      },
      message: msg.SUCCESS_ACTION('joined', entity),
    };

    chai
      .request(app)
      .put(`/api/home/join`)
      .send({ homeId, userId: userId1 })
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
        chai.expect(res.body).to.shallowDeepEqual(expectedBody);
        done();
      });
  });

  it('should leave an existing home', function (done) {
    const expectedBody = {
      message: msg.SUCCESS_ACTION('left', entity),
    };

    chai
      .request(app)
      .put(`/api/home/leave`)
      .send({ homeId, userId: userId1 })
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
        chai.expect(res.body).to.shallowDeepEqual(expectedBody);
        chai.expect(res.body.home.users).to.not.contain(userId1);
        done();
      });
  });
});

describe('Admin user deletes their home', () => {
  it('should delete an existing home', function (done) {
    const expectedBody = {
      message: msg.SUCCESS_DELETE(entity),
    };

    chai
      .request(app)
      .delete(`/api/home/delete`)
      .send({ adminUser: adminUserId, homeId })
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
        chai.expect(res.body).to.shallowDeepEqual(expectedBody);
        homeId = res.body.homeId;
        done();
      });
  });
});
