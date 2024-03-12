import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
import app from '../index.js';
import mongoose from 'mongoose';
import 'dotenv/config';
import assert from 'assert';
import * as msg from '../common/messages.js';
import { entity } from '../controllers/notification-controller.js';
import NotificationModel from '../models/notification/notification-model.js';

assert(process.env.ENV == 'TEST');
chai.use(chaiHttp);
chai.use(chaiShallowDeepEqual);

// CRUD

describe('CRUD API Notification', () => {
  const notificationId = new mongoose.Types.ObjectId();
  const sender = new mongoose.Types.ObjectId();
  const recipient = new mongoose.Types.ObjectId();
  const notification = {
    _id: notificationId.toString(),
    sender: sender.toString(),
    recipients: [recipient.toString()],
    message: 'Hello!',
  };

  before('Connect to MongoDB', async () => {
    await mongoose.connect(process.env.DB_CLOUD_URI_TEST);
  });

  beforeEach('Clear DB', async () => {
    await NotificationModel.deleteMany();
    await NotificationModel.create(notification);
  });

  describe('POST api/notification', () => {
    it('should create a new notification', (done) => {
      const newNotification = {
        sender: new mongoose.Types.ObjectId().toString(),
        recipients: [new mongoose.Types.ObjectId().toString()],
        message: 'This is new!',
      };

      const expectedBody = {
        message: msg.SUCCESS_CREATE(entity),
        notification: newNotification,
      };

      chai
        .request(app)
        .post('/api/notification')
        .send(newNotification)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_CREATED);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });

    it('should not create a new notification (missing field)', (done) => {
      const newNotification = {
        sender: new mongoose.Types.ObjectId(),
        // recipient: new mongoose.Types.ObjectId(),
        recipient_type: 'user',
        message: 'Missing field!',
      };
      const expectedBody = { message: msg.FAIL_MISSING_FIELDS };

      chai
        .request(app)
        .post('/api/notification')
        .send(newNotification)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_BAD_REQUEST);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });
  });

  describe('GET api/notification/user/:userId (by recipient)', () => {
    it('should obtain an existing notification data', (done) => {
      const expectedBody = {
        message: msg.SUCCESS_READ(entity),
        notification: [notification],
      };

      chai
        .request(app)
        .get(`/api/notification/user/${recipient}`)
        .send()
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });
  });

  describe('GET api/notification/:notificationId', () => {
    it('should obtain an existing notification data', (done) => {
      const expectedBody = {
        message: msg.SUCCESS_READ(entity),
        notification: { _id: notificationId.toString() },
      };

      chai
        .request(app)
        .get(`/api/notification/${notificationId}`)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });
  });

  describe('DELETE api/notification/:notificationId', () => {
    it('should delete an existing notification', (done) => {
      const expectedBody = { message: msg.SUCCESS_DELETE(entity) };

      chai
        .request(app)
        .delete(`/api/notification/${notificationId}`)
        .send({ userId: recipient })
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });

    it('should not delete an existing notification (missing userId)', (done) => {
      const expectedBody = { message: msg.FAIL_MISSING_FIELDS };

      chai
        .request(app)
        .delete(`/api/notification/${notificationId}`)
        .send()
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_BAD_REQUEST);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });

    it('should not delete an existing notification (not a recipient)', (done) => {
      const expectedBody = { message: msg.FAIL_UNAUTHORIZED };

      chai
        .request(app)
        .delete(`/api/notification/${notificationId}`)
        .send({ userId: sender })
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_UNAUTHORIZED);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });
  });
});
