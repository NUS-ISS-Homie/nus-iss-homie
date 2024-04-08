import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
import mongoose from 'mongoose';
import assert from 'assert';
import 'dotenv/config';

import * as constants from '../common/messages.js';
import ChoreModel from '../models/chore/chore-model.js';
import HomeModel from '../models/home/home-model.js';
import UserModel from '../models/user/user-model.js';
import NotificationModel from '../models/notification/notification-model.js';
import { entity } from '../controllers/chore-controller.js';
import app from '../index.js';

assert(process.env.ENV == 'TEST');
chai.use(chaiHttp);
chai.use(chaiShallowDeepEqual);

describe('Chore API CRUD', () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const user1 = {
    _id: new mongoose.Types.ObjectId().toString(),
    username: 'user1',
  };

  const user2 = {
    _id: new mongoose.Types.ObjectId().toString(),
    username: 'user2',
  };

  const home = {
    _id: new mongoose.Types.ObjectId().toString(),
    adminUser: user1._id,
    users: [user2._id],
  };

  const notification = {
    _id: new mongoose.Types.ObjectId().toString(),
    sender: user1._id,
    recipients: [user2._id],
    message: { title: 'Notification Title', content: 'Hello!' },
  };

  const chore1 = {
    _id: new mongoose.Types.ObjectId().toString(),
    title: 'Chore 1',
    assignedTo: user1.username,
    scheduledDate: today,
    home: home._id,
    requestSwapNotificationId: notification._id,
  };

  const chore2 = {
    _id: new mongoose.Types.ObjectId().toString(),
    title: 'Chore 2',
    assignedTo: user2.username,
    scheduledDate: today,
    home: home._id,
    requestSwapNotificationId: notification._id,
  };

  before('Connect to MongoDB', async () => {
    await mongoose.connect(process.env.DB_CLOUD_URI_TEST);
  });

  beforeEach('Clear DB and insert test data', async () => {
    // Create Users
    await UserModel.deleteMany();
    await UserModel.create({ ...user1, hashedPassword: 'password' });
    await UserModel.create({ ...user2, hashedPassword: 'password' });

    // Create Home
    await HomeModel.deleteMany();
    await HomeModel.create(home);

    // Create Notification
    await NotificationModel.deleteMany();
    await NotificationModel.create(notification);

    // Create Chores
    await ChoreModel.deleteMany();
    await ChoreModel.create(chore1);
    await ChoreModel.create(chore2);
  });

  describe('POST /api/chore', () => {
    it('should create a new chore', (done) => {
      const newChore = {
        title: 'New Chore',
        assignedTo: user1,
        scheduledDate: new Date(),
        home: home._id,
      };

      const expectedBody = {
        message: constants.SUCCESS_CREATE(entity, newChore.title),
      };

      chai
        .request(app)
        .post('/api/chore')
        .send(newChore)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_CREATED);
          chai.expect(res.body).to.deep.equal(expectedBody);
          done();
        });
    });
    it('should return a 400 Bad Request for incomplete or invalid data', (done) => {
      const invalidChoreData = {}; // Invalid data with missing fields

      chai
        .request(app)
        .post('/api/chore')
        .send(invalidChoreData)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_BAD_REQUEST);
          // Adjust the expectation for the response body message based on your application's behavior
          chai.expect(res.body.message).to.equal(constants.FAIL_MISSING_FIELDS);
          done();
        });
    });
  });

  describe('GET /api/chore/:id', () => {
    it('should retrieve a specific chore by ID', (done) => {
      const expected = {
        ...chore1,
        scheduledDate: chore1.scheduledDate.toISOString(),
      };

      chai
        .request(app)
        .get(`/api/chore/${chore1._id}`)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
          chai.expect(res.body.chore).to.shallowDeepEqual(expected);
          done();
        });
    });
    // Negative test case: Invalid chore ID
    it('should not return for non-existent chore ID', (done) => {
      const invalidChoreId = 'invalid_id';

      const expected = { message: constants.FAIL_NOT_EXIST(entity) };

      chai
        .request(app)
        .get(`/api/chore/${invalidChoreId}`)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_NOT_FOUND);
          chai.expect(res.body).to.deep.equal(expected);
          done();
        });
    });
  });

  // Add more test cases for other CRUD operations (GET, PUT, DELETE) as needed
  describe('GET /api/chore/home/:homeId', () => {
    it('should retrieve chores based on homeId', (done) => {
      const homeId = home._id;
      const chores = {
        chores: [
          {
            ...chore1,
            scheduledDate: chore1.scheduledDate.toISOString(),
          },
          {
            ...chore2,
            scheduledDate: chore2.scheduledDate.toISOString(),
          },
        ],
      };

      chai
        .request(app)
        .get(`/api/chore/home/${homeId}`)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
          chai.expect(res.body).to.shallowDeepEqual(chores);
          done();
        });
    });
    // Negative test case: Invalid home ID
    it('should not return for non-existent home ID', (done) => {
      const invalidHomeId = 'invalid_id';

      const expected = { message: constants.FAIL_NOT_EXIST(entity) };

      chai
        .request(app)
        .get(`/api/chore/home/${invalidHomeId}`)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_NOT_FOUND);
          chai.expect(res.body).to.deep.equal(expected);
          done();
        });
    });
  });

  describe('GET /api/chore/notification/:notificationId', () => {
    it('should retrieve chores based on notificationId', (done) => {
      const notificationId = notification._id;
      const chores = {
        chores: [
          {
            ...chore1,
            scheduledDate: chore1.scheduledDate.toISOString(),
          },
          {
            ...chore2,
            scheduledDate: chore2.scheduledDate.toISOString(),
          },
        ],
      };

      chai
        .request(app)
        .get(`/api/chore/notification/${notificationId}`)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
          chai.expect(res.body).to.shallowDeepEqual(chores);
          done();
        });
    });
    it('should not return for non-existent notification ID', (done) => {
      const invalidNotificationId = 'invalid_id';

      const expected = { message: constants.FAIL_NOT_EXIST(entity) };

      chai
        .request(app)
        .get(`/api/chore/notification/${invalidNotificationId}`)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_NOT_FOUND);
          chai.expect(res.body).to.deep.equal(expected);
          done();
        });
    });
  });

  describe('PUT /api/chore/:id', () => {
    it('should update an existing chore', (done) => {
      const updatedChore = { ...chore2, title: 'CHORE2' };

      chai
        .request(app)
        .put(`/api/chore/${updatedChore._id}`)
        .send(updatedChore)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
          chai
            .expect(res.body.message)
            .to.equal(constants.SUCCESS_UPDATE(entity));
          done();
        });
    });

    // negative PUT test
    it('should return a 404 Not Found for an invalid chore ID', (done) => {
      const invalidId = new mongoose.Types.ObjectId().toString();
      const updatedChore = {
        ...chore1,
        title: 'CHORE1',
        _id: null,
      };

      chai
        .request(app)
        .put(`/api/chore/${invalidId}`)
        .send(updatedChore)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_NOT_FOUND);
          chai
            .expect(res.body.message)
            .to.equal(constants.FAIL_NOT_EXIST(entity));
          done();
        });
    });
  });

  describe('DELETE /api/chore/:id', () => {
    it('should delete an existing chore', (done) => {
      chai
        .request(app)
        .delete(`/api/chore/${chore2._id}`)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
          chai
            .expect(res.body.message)
            .to.equal(constants.SUCCESS_DELETE(entity));
          done();
        });
    });

    it('should return a 404 Not Found for an invalid chore ID', (done) => {
      const invalidChoreId = 'invalid_id';

      chai
        .request(app)
        .delete(`/api/chore/${invalidChoreId}`)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_NOT_FOUND);
          chai
            .expect(res.body.message)
            .to.equal(constants.FAIL_NOT_EXIST(entity));
          done();
        });
    });
  });

  after('Disconnect from MongoDB', async () => {
    await mongoose.connection.close();
  });
});
