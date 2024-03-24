import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
import io from 'socket.io-client';
import app from '../index.js';
import mongoose from 'mongoose';
import 'dotenv/config';
import assert from 'assert';
import * as msg from '../common/messages.js';
import { entity } from '../controllers/home-controller.js';
import HomeModel from '../models/home/home-model.js';
import { FAIL_NOT_TENANT } from '../models/home/home-messages.js';
import UserModel from '../models/user/user-model.js';

assert(process.env.ENV == 'TEST');
chai.use(chaiHttp);
chai.use(chaiShallowDeepEqual);

// Socket
const DEV_SERVER_URI = `http://localhost:${process.env.PORT}`;
console.log(DEV_SERVER_URI);

const SOCKET_OPTIONS = {
  transports: ['websocket'],
  forceNew: true,
  'reconnection delay': 0,
  'reopen delay': 0,
};

let user1, user2, user3;
const sessionStorage = new Map();

describe('Socket connection', () => {
  it('should connect user1', (done) => {
    user1 = io(DEV_SERVER_URI, {
      ...SOCKET_OPTIONS,
      auth: { userId: 'user1' },
    });
    user1.on('connect', done);
    user1.connect();
  });

  it('should connect user2', (done) => {
    user2 = io(DEV_SERVER_URI, {
      ...SOCKET_OPTIONS,
      auth: { userId: 'user2' },
    });
    user2.on('connect', done);
    user2.connect();
  });

  it('should connect user3', (done) => {
    user3 = io(DEV_SERVER_URI, {
      ...SOCKET_OPTIONS,
      auth: { userId: 'user3' },
    });
    user3.on('connect', done);
    user3.connect();
  });
});

describe('[Event] Join Home', () => {
  let homeId1 = 'home1',
    homeId2 = 'home2';

  it(`Users should join ${homeId1}`, (done) => {
    user2.on('joined-home', done);
    user1.emit('join-home', homeId1);
    user2.emit('join-home', homeId1);
  });

  it(`User3 should join ${homeId2}`, (done) => {
    user3.on('joined-home', done);
    user3.emit('join-home', homeId2);
  });

  describe('[Event] Send Notification', () => {
    it(`should only send notification to ${homeId1}`, (done) => {
      user3.on('notify', () => assert.fail('should not get here!'));
      user1.emit('send-notification', homeId1);
      user2.on('notify', done);
    });
  });

  describe('[Event] Leave Home', () => {
    it(`User1 should leave ${homeId1}`, (done) => {
      user1.emit('leave-home');
      user1.on('left-home', done);
    });

    it(`User2 should leave ${homeId1}`, (done) => {
      user2.on('left-home', done);
      user2.emit('leave-home');
    });

    it(`User3 should leave ${homeId1}`, (done) => {
      user3.on('left-home', done);
      user3.emit('leave-home');
    });
  });
});

describe('Socket disconnect', () => {
  it('should disconnect user1', (done) => {
    user1.on('disconnect', () => done());
    user1.disconnect();
  });

  it('should disconnect user2', (done) => {
    user2.on('disconnect', () => done());
    user2.disconnect();
  });

  it('should disconnect user3', (done) => {
    user3.on('disconnect', () => done());
    user3.disconnect();
  });
});

// CRUD

describe('CRUD API', () => {
  const adminUser = {
    _id: new mongoose.Types.ObjectId().toString(),
    username: 'adminUser',
  };
  const user1 = {
    _id: new mongoose.Types.ObjectId().toString(),
    username: 'user1',
  };
  const user2 = {
    _id: new mongoose.Types.ObjectId().toString(),
    username: 'user2',
  };
  const homeId = new mongoose.Types.ObjectId().toString();

  before('Connect to MongoDB', async () => {
    await mongoose.connect(process.env.DB_CLOUD_URI_TEST);
  });

  beforeEach('Clear DB', async () => {
    // Create Users
    await UserModel.deleteMany();
    await UserModel.create({ ...adminUser, hashedPassword: 'password' });
    await UserModel.create({ ...user1, hashedPassword: 'password' });
    await UserModel.create({ ...user2, hashedPassword: 'password' });

    await HomeModel.deleteMany();
    await HomeModel.create({
      _id: homeId,
      adminUser: adminUser._id,
      users: [user1._id],
    });
  });

  describe('POST api/home', () => {
    it('should create a new home', (done) => {
      const expectedBody = {
        message: msg.SUCCESS_CREATE(entity),
        home: { adminUser: user2 },
      };

      chai
        .request(app)
        .post('/api/home')
        .send({ adminUser: user2._id })
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_CREATED);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });

    it('should not create a new home (missing userId)', (done) => {
      const expectedBody = { message: msg.FAIL_MISSING_FIELDS };

      chai
        .request(app)
        .post('/api/home')
        .send()
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_BAD_REQUEST);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });
  });

  describe('GET api/home (by userId)', () => {
    it('should obtain an existing home data', (done) => {
      const expectedBody = {
        message: msg.SUCCESS_READ(entity),
        home: { _id: homeId },
      };

      chai
        .request(app)
        .put('/api/home')
        .send({ userId: adminUser._id })
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });

    it('should not obtain an existing home data (missing userId)', (done) => {
      const expectedBody = { message: msg.FAIL_MISSING_FIELDS };

      chai
        .request(app)
        .put(`/api/home`)
        .send()
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_BAD_REQUEST);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });
  });

  describe('GET api/home/:homeId', () => {
    it('should obtain an existing home data', (done) => {
      const expectedBody = {
        message: msg.SUCCESS_READ(entity),
        home: { _id: homeId },
      };

      chai
        .request(app)
        .get(`/api/home/${homeId}`)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });
  });

  describe('PUT api/home/:homeId/join', () => {
    it('should join an existing home', (done) => {
      const expectedHome = { adminUser, users: [user1, user2] };

      chai
        .request(app)
        .put(`/api/home/${homeId}/join`)
        .send({ userId: user2._id })
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
          chai
            .expect(res.body.message)
            .to.equal(msg.SUCCESS_ACTION('joined', entity));
          chai.expect(res.body.home).to.shallowDeepEqual(expectedHome);
          done();
        });
    });

    it('should not join an existing home (missing userId)', (done) => {
      const expectedBody = { message: msg.FAIL_MISSING_FIELDS };

      chai
        .request(app)
        .put(`/api/home/${homeId}/join`)
        .send()
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_BAD_REQUEST);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });

    it('should not join home (inexistent home)', (done) => {
      const randomId = new mongoose.Types.ObjectId();
      const expectedBody = { message: msg.FAIL_NOT_EXIST(entity) };

      chai
        .request(app)
        .put(`/api/home/${randomId}/join`)
        .send({ userId: user2._id })
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_NOT_FOUND);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });
  });

  describe('PUT api/home/leave', () => {
    it('should leave an existing home', (done) => {
      const expectedBody = { message: msg.SUCCESS_ACTION('left', entity) };

      chai
        .request(app)
        .put('/api/home/leave')
        .send({ userId: user1._id })
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          chai.expect(res.body.home.users).to.not.contain(user1._id);
          done();
        });
    });

    it('should not leave an existing home (missing userId)', (done) => {
      const expectedBody = { message: msg.FAIL_MISSING_FIELDS };

      chai
        .request(app)
        .put('/api/home/leave')
        .send()
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_BAD_REQUEST);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });

    it('should not leave an existing home (user not a tenant)', (done) => {
      const expectedBody = { message: FAIL_NOT_TENANT };

      chai
        .request(app)
        .put('/api/home/leave')
        .send({ userId: user2._id })
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_BAD_REQUEST);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });
  });

  describe('DELETE api/home', () => {
    const homeId = new mongoose.Types.ObjectId();

    it('should delete an existing home', (done) => {
      const expectedBody = { message: msg.SUCCESS_DELETE(entity) };

      chai
        .request(app)
        .delete(`/api/home`)
        .send({ userId: adminUser._id })
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });

    it('should not delete an existing home (userId is not a tenant)', (done) => {
      const expectedBody = { message: msg.FAIL_UNAUTHORIZED };

      chai
        .request(app)
        .delete(`/api/home`)
        .send({ userId: user2._id })
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_UNAUTHORIZED);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });
  });
});
