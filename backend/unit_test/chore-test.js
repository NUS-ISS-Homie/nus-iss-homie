import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
import mongoose from 'mongoose';
import assert from 'assert';
import 'dotenv/config';

import * as constants from '../common/messages.js';
import { entity } from '../controllers/chore-controller.js';
import ChoreModel from '../models/chore/chore-model.js';
import app from '../index.js';

const expect = chai.expect;

assert(process.env.ENV == 'TEST');

chai.use(chaiHttp);
chai.use(chaiShallowDeepEqual);

describe('Chore API CRUD', () => {
  before('Connect to MongoDB', async () => {
    await mongoose.connect(process.env.DB_CLOUD_URI_TEST);
  });

  beforeEach('Clear DB and insert test data', async () => {
    await ChoreModel.deleteMany();
    await ChoreModel.create({
      title: 'Chore 1',
      assignedTo: 'User 1',
      dueDate: '2024-02-28',
    });
    await ChoreModel.create({
      title: 'Chore 2',
      assignedTo: 'User 2',
      dueDate: '2024-01-20',
    });
  });

  describe('POST /api/chore/create', () => {
    it('should create a new chore', (done) => {
      const newChore = {
        title: 'New Chore',
        assignedTo: 'New User',
        dueDate: '2024-01-01',
      };

      const expectedBody = {
        message: constants.SUCCESS_CREATE(entity, newChore.title),
      };

      chai
        .request(app)
        .post('/api/chore/create')
        .send(newChore)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_CREATED);
          chai.expect(res.body).to.deep.equal(expectedBody);
          done();
        });
    });
  });

  describe('POST /api/chore/create', () => {
    it('should return a 400 Bad Request for incomplete or invalid data', (done) => {
      const invalidChoreData = {}; // Invalid data with missing fields

      chai
        .request(app)
        .post('/api/chore/create')
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

  // Add more test cases for other CRUD operations (GET, PUT, DELETE) as neededs
  describe('GET /api/chore/:id', () => {
    it('should retrieve a specific chore by ID', async () => {
      const chore = await ChoreModel.findOne({ title: 'Chore 1' });

      const res = await chai.request(app).get(`/api/chore/${chore._id}`);
      console.log('res: ', res.body);
      chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
      chai.expect(res.body.chore.title).to.equal('Chore 1');
      chai.expect(res.body.chore.assignedTo).to.equal('User 1');
      chai.expect(res.body.chore.dueDate.slice(0, 10)).to.equal('2024-02-28');
    });
  });

  // Negative test case: Invalid chore ID
  describe('GET /api/chore/:id', () => {
    it('should return a 400 Bad Request for an invalid chore ID', async () => {
      const invalidChoreId = 'invalid_id';

      const res = await chai.request(app).get(`/api/chore/${invalidChoreId}`);

      chai.expect(res).to.have.status(constants.STATUS_CODE_NOT_FOUND);
      chai.expect(res.body.message).to.equal('Chore not found');
    });
  });

  describe('PUT /api/chore/:id', () => {
    it('should update an existing chore', async () => {
      const chore = await ChoreModel.findOne({ title: 'Chore 1' });

      const updatedChore = {
        title: 'Updated Chore',
        assignedTo: 'User 3',
        dueDate: '2024-02-24',
      };

      const res = await chai
        .request(app)
        .put(`/api/chore/${chore._id}`)
        .send(updatedChore);
      console.log('res: ', res.body);

      chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
      chai
        .expect(res.body.message)
        .to.equal(constants.SUCCESS_UPDATE(entity, 'Updated Chore'));
    });
  });

  // negative PUT test
  describe('PUT /api/chore/:id', () => {
    it('should return a 404 Not Found for an invalid chore ID', async () => {
      const invalidChoreId = 'invalid_id';

      const updatedChore = {
        title: 'Updated Chore',
        assignedTo: 'User 3',
        dueDate: '2024-02-24',
      };

      const res = await chai
        .request(app)
        .put(`/api/chore/${invalidChoreId}`)
        .send(updatedChore);

      chai.expect(res).to.have.status(constants.STATUS_CODE_NOT_FOUND);
      chai.expect(res.body.message).to.equal('Chore not found');
    });
  });

  describe('DELETE /api/chore/:id', () => {
    it('should delete an existing chore', async () => {
      const chore = await ChoreModel.findOne({ title: 'Chore 2' });

      const res = await chai.request(app).delete(`/api/chore/${chore._id}`);

      chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
      chai.expect(res.body.message).to.equal(constants.SUCCESS_DELETE(entity));
    });
  });

  describe('DELETE /api/chrore/:id', () => {
    it('should return a 404 Not Found for an invalid chore ID', async () => {
      const invalidChoreId = 'invalid_id';

      const res = await chai
        .request(app)
        .delete(`/api/chore/${invalidChoreId}`);

      chai.expect(res).to.have.status(constants.STATUS_CODE_NOT_FOUND);
      chai.expect(res.body.message).to.equal('Chore not found'); // Adjust this message according to your application's response
    });
  });

  after('Disconnect from MongoDB', async () => {
    await mongoose.connection.close();
  });
});
