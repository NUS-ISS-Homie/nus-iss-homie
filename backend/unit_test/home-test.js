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

assert(process.env.ENV == 'TEST');
chai.use(chaiHttp);
chai.use(chaiShallowDeepEqual);

// Socket
const DEV_SERVER_URI = `http://localhost:${process.env.PORT}`;

const SOCKET_OPTIONS = {
  transports: ['websocket'],
  'force new connection': true,
};

let user1, user2, user3;

describe('Socket connection', () => {
  it('should connect user1', (done) => {
    user1 = io.connect(DEV_SERVER_URI, SOCKET_OPTIONS);
    user1.on('connect', done);
  });

  it('should connect user2', (done) => {
    user2 = io.connect(DEV_SERVER_URI, SOCKET_OPTIONS);
    user2.on('connect', done);
  });

  it('should connect user3', (done) => {
    user3 = io.connect(DEV_SERVER_URI, SOCKET_OPTIONS);
    user3.on('connect', done);
  });
});

describe('[Event] Join Home', () => {
  let homeId1 = 'home1',
    homeId2 = 'home2';

  it(`User1 should join ${homeId1}`, (done) => {
    user1.on('joined-home', done);
    user1.emit('join-home', homeId1);
  });

  it(`User2 should join ${homeId1}`, (done) => {
    user2.on('joined-home', done);
    user2.emit('join-home', homeId1);
  });

  it(`User3 should join ${homeId2}`, (done) => {
    user3.on('joined-home', done);
    user3.emit('join-home', homeId2);
  });

  describe('[Event] Send Notification', () => {
    const notification = { homeId: homeId1, message: 'hello!' };

    it(`should only send notification to ${homeId1}`, (done) => {
      user2.on('notify', (notification) => {
        chai.expect(notification).to.equal(notification);
        done();
      });
      user3.on('notify', () => assert.fail('should not get here!'));
      user1.emit('send-notification', notification);
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
  const adminUsername = 'adminUser';
  const username = 'user1';
  const homeId = new mongoose.Types.ObjectId();

  before('Connect to MongoDB', async () => {
    await mongoose.connect(process.env.DB_CLOUD_URI_TEST);
  });

  beforeEach('Clear DB', async () => {
    await HomeModel.deleteMany();
    await HomeModel.create({ _id: homeId, adminUser: adminUsername });
  });

  describe('POST api/home', () => {
    it('should create a new home', (done) => {
      const newAdmin = 'newAdmin';
      const expectedBody = {
        message: msg.SUCCESS_CREATE(entity),
        home: { adminUser: newAdmin },
      };

      chai
        .request(app)
        .post('/api/home')
        .send({ adminUser: newAdmin })
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_CREATED);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });

    it('should not create a new home (missing username)', (done) => {
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

  describe('GET api/home (by username)', () => {
    it('should obtain an existing home data', (done) => {
      const expectedBody = {
        message: msg.SUCCESS_READ(entity),
        home: { _id: homeId.toString() },
      };

      chai
        .request(app)
        .get('/api/home')
        .send({ username: adminUsername })
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });

    it('should not obtain an existing home data (missing username)', (done) => {
      const expectedBody = { message: msg.FAIL_MISSING_FIELDS };

      chai
        .request(app)
        .get(`/api/home`)
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
        home: { _id: homeId.toString() },
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
      const username1 = 'username1';

      const expectedBody = {
        home: { users: username1 },
        message: msg.SUCCESS_ACTION('joined', entity),
      };

      chai
        .request(app)
        .put(`/api/home/${homeId}/join`)
        .send({ username: username1 })
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });

    it('should not join an existing home (missing username)', (done) => {
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
      const username1 = 'username1';
      const randomId = new mongoose.Types.ObjectId();
      const expectedBody = { message: msg.FAIL_NOT_EXIST(entity) };

      chai
        .request(app)
        .put(`/api/home/${randomId}/join`)
        .send({ username: username1 })
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
        .send({ username: adminUsername })
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          chai.expect(res.body.home.users).to.not.contain(username);
          done();
        });
    });

    it('should not leave an existing home (missing username)', (done) => {
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
      const username1 = 'username1';
      const expectedBody = { message: FAIL_NOT_TENANT };

      chai
        .request(app)
        .put('/api/home/leave')
        .send({ username: username1 })
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
        .send({ username: adminUsername })
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });

    it('should not delete an existing home (username is not a tenant)', (done) => {
      const expectedBody = { message: msg.FAIL_UNAUTHORIZED };
      const oddUser = 'oddUser';

      chai
        .request(app)
        .delete(`/api/home`)
        .send({ username: oddUser })
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_UNAUTHORIZED);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });
  });
});
