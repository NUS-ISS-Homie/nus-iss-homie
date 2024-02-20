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

describe('[Event] Join Home', function () {
  let homeId1 = 'home1',
    homeId2 = 'home2';

  it(`User1 should join ${homeId1}`, function (done) {
    user1.emit('join-home', homeId1);
    user1.on('joined-home', done);
  });

  it(`User2 should join ${homeId1}`, function (done) {
    user2.emit('join-home', homeId1);
    user2.on('joined-home', done);
  });

  it(`User3 should join ${homeId2}`, function (done) {
    user3.emit('join-home', homeId2);
    user3.on('joined-home', done);
  });

  describe('[Event] Send Notification', function () {
    const notification = { homeId: homeId1, message: 'hello!' };

    it(`should only send notification to ${homeId1}`, function (done) {
      user1.emit('send-notification', notification);
      user2.on('notify', (notification) => {
        chai.expect(notification).to.equal(notification);
        done();
      });
      user3.on('notify', () => assert.fail('should not get here!'));
    });
  });

  describe('[Event] Leave Home', function () {
    it(`User1 should leave ${homeId1}`, function (done) {
      user1.emit('leave-home');
      user1.on('left-home', done);
    });

    it(`User2 should leave ${homeId1}`, function (done) {
      user2.emit('leave-home');
      user2.on('left-home', done);
    });

    it(`User3 should leave ${homeId1}`, function (done) {
      user3.emit('leave-home');
      user3.on('left-home', done);
    });
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
