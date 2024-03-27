import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
import mongoose from 'mongoose';
import assert from 'assert';
import 'dotenv/config';

import * as constants from '../common/messages.js';
import UserModel from '../models/user/user-model.js';
import ExpenseModel from '../models/expense/expense-model.js';
import { entity } from '../controllers/expense-controller.js';
import app from '../index.js';

assert(process.env.ENV == 'TEST');
chai.use(chaiHttp);
chai.use(chaiShallowDeepEqual);

describe('Expense API CRUD', () => {
  const user1 = {
    _id: new mongoose.Types.ObjectId().toString(),
    username: 'user1',
  };

  const user2 = {
    _id: new mongoose.Types.ObjectId().toString(),
    username: 'user2',
  };

  const expense1 = {
    _id: new mongoose.Types.ObjectId().toString(),
    title: 'Grocery',
    amount: 50.0,
    category: 'Food',
    user: user1._id,
  };

  const expense2 = {
    _id: new mongoose.Types.ObjectId().toString(),
    title: 'Rent',
    amount: 1000.0,
    category: 'Housing',
    user: user2._id,
  };

  before(
    'Connect to MongoDB',
    async () => await mongoose.connect(process.env.DB_CLOUD_URI_TEST)
  );

  beforeEach('Clear DB and insert test data', async () => {
    // Create Users
    await UserModel.deleteMany();
    await UserModel.create({ ...user1, hashedPassword: 'password' });
    await UserModel.create({ ...user2, hashedPassword: 'password' });

    // Create Expenses
    await ExpenseModel.deleteMany();
    await ExpenseModel.create(expense1);
    await ExpenseModel.create(expense2);
  });

  describe('POST /api/expense', () => {
    it('should create a new expense', (done) => {
      const newExpense = {
        title: 'Utilities',
        amount: 65.0,
        category: 'Housing',
        user: user1._id,
      };

      const expectedBody = {
        message: constants.SUCCESS_CREATE(entity, newExpense.title),
      };

      chai
        .request(app)
        .post('/api/expense')
        .send(newExpense)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_CREATED);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });
  });

  describe('POST /api/expense', () => {
    it('should return a 400 Bad Request for incomplete or invalid data', (done) => {
      const invalidExpenseData = {
        title: 'Utilities',
        amount: 65.0,
        category: 'Housing',
      }; // Invalid data with missing user

      chai
        .request(app)
        .post('/api/expense')
        .send(invalidExpenseData)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_BAD_REQUEST);
          chai.expect(res.body.message).to.equal(constants.FAIL_MISSING_FIELDS);
          done();
        });
    });
  });

  describe('GET /api/expense/:id', () => {
    it('should retrieve a specific expense by ID', (done) => {
      const expected = { ...expense1, user: user1 };
      chai
        .request(app)
        .get(`/api/expense/${expense1._id}`)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
          chai.expect(res.body.expense).to.shallowDeepEqual(expected);
          done();
        });
    });
  });

  // Negative test case: Invalid expense ID
  describe('GET /api/expense/:id', () => {
    it('should return a 400 Bad Request for an invalid expense ID', (done) => {
      const invalidExpenseId = 'invalid_id';

      const expected = { message: constants.FAIL_NOT_EXIST(entity) };

      chai
        .request(app)
        .get(`/api/expense/${invalidExpenseId}`)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_NOT_FOUND);
          chai.expect(res.body).to.deep.equal(expected);
          done();
        });
    });
  });

  describe('PUT /api/expense/:id', () => {
    it('should update an existing expense', (done) => {
      const updatedExpense = { ...expense2, amount: 1200 };

      chai
        .request(app)
        .put(`/api/expense/${updatedExpense._id}`)
        .send(updatedExpense)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
          chai
            .expect(res.body.message)
            .to.equal(constants.SUCCESS_UPDATE(entity));
          done();
        });
    });
  });

  // negative PUT test
  describe('PUT /api/expense/:id', () => {
    it('should return a 404 Not Found for an invalid expense ID', (done) => {
      const invalidId = new mongoose.Types.ObjectId().toString();
      const updatedExpense = {
        ...expense1,
        amount: 50,
        _id: null,
      };

      chai
        .request(app)
        .put(`/api/expense/${invalidId}`)
        .send(updatedExpense)
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

  describe('DELETE /api/expense/:id', () => {
    it('should delete an existing expense', (done) => {
      chai
        .request(app)
        .delete(`/api/expense/${expense2._id}`)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
          chai
            .expect(res.body.message)
            .to.equal(constants.SUCCESS_DELETE(entity));
          done();
        });
    });
  });

  describe('DELETE /api/expense/:id', () => {
    it('should return a 404 Not Found for an invalid expense ID', (done) => {
      const invalidExpenseId = 'invalid_id';

      chai
        .request(app)
        .delete(`/api/expense/${invalidExpenseId}`)
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
