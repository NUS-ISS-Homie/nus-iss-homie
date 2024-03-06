import bcryptjs from 'bcryptjs';
import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
import mongoose from 'mongoose';
import assert from 'assert';
import 'dotenv/config';

import * as constants from '../common/messages.js';
import { entity } from '../controllers/expense-controller.js';
import ExpenseModel from '../models/expense/expense-model.js';
import app from '../index.js';

const expect = chai.expect;

assert(process.env.ENV == 'TEST');
const saltRounds = parseInt(process.env.SALT_ROUNDS);

chai.use(chaiHttp);
chai.use(chaiShallowDeepEqual);

describe('Expense API CRUD', () => {
  before('Connect to MongoDB', async () => {
    // await mongoose.connect('mongodb://localhost:27017/testdb', {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });
    await mongoose.connect(process.env.DB_CLOUD_URI_TEST);
  });

  beforeEach('Clear DB and insert test data', async () => {
    await ExpenseModel.deleteMany();
    await ExpenseModel.create({
      title: 'Expense 1',
      amount: 50.0,
      category: 'Food',
      username: 'user123',
    });
    await ExpenseModel.create({
      title: 'Expense 2',
      amount: 100.0,
      category: 'Transportation',
      username: 'user456',
    });
  });

  describe('POST /api/expense/create', () => {
    it('should create a new expense', (done) => {
      const newExpense = {
        title: 'New Expense',
        amount: 30,
        category: 'Food',
        username: 'user1234',
      };

      const expectedBody = {
        message: constants.SUCCESS_CREATE(entity, newExpense.title),
      };

      chai
        .request(app)
        .post('/api/expense/create')
        .send(newExpense)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_CREATED);
          chai.expect(res.body).to.deep.equal(expectedBody);
          done();
        });
    });
  });

  describe('POST /api/expense/create', () => {
    it('should return a 400 Bad Request for incomplete or invalid data', (done) => {
      const invalidExpenseData = {}; // Invalid data with missing fields

      chai
        .request(app)
        .post('/api/expense/create')
        .send(invalidExpenseData)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_BAD_REQUEST);
          // Adjust the expectation for the response body message based on your application's behavior
          chai.expect(res.body.message).to.equal(constants.FAIL_MISSING_FIELDS);
          done();
        });
    });
  });

  describe('GET /api/expense', () => {
    it('should retrieve all expenses', async () => {
      // Make a request to fetch all expenses
      const res = await chai.request(app).get(`/api/expense`);

      // Assertions
      chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
      chai.expect(res.body.expenses).to.be.an('array');
      chai.expect(res.body.expenses).to.have.length.greaterThan(0); // Ensure at least one expense is returned
      // You can add more specific assertions based on your expected data structure
    });
  });


  // Add more test cases for other CRUD operations (GET, PUT, DELETE) as neededs
  describe('GET /api/expense/:id', () => {
    it('should retrieve a specific expense by ID', async () => {
      const expense = await ExpenseModel.findOne({ title: 'Expense 1' });

      const res = await chai.request(app).get(`/api/expense/${expense._id}`);
      console.log('res: ', res.body);
      chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
      chai.expect(res.body.expense.title).to.equal('Expense 1');
      chai.expect(res.body.expense.amount).to.equal(50.0);
      chai.expect(res.body.expense.category).to.equal('Food');
      chai.expect(res.body.expense.username).to.equal('user123');
    });
  });

  // Negative test case: Invalid expense ID
  describe('GET /api/expense/:id', () => {
    it('should return a 400 Bad Request for an invalid expense ID', async () => {
      const invalidExpenseId = 'invalid_id';

      const res = await chai
        .request(app)
        .get(`/api/expense/${invalidExpenseId}`);

      chai.expect(res).to.have.status(constants.STATUS_CODE_NOT_FOUND);
      chai.expect(res.body.message).to.equal('Expense not found');
    });
  });

  describe('PUT /api/expense/:id', () => {
    it('should update an existing expense', async () => {
      const expense = await ExpenseModel.findOne({ title: 'Expense 1' });

      const updatedExpense = {
        title: 'Updated Expense',
        amount: 75.0,
        category: 'Transportation',
        username: 'user123',
      };

      const res = await chai
        .request(app)
        .put(`/api/expense/${expense._id}`)
        .send(updatedExpense);
      console.log('res: ', res.body);

      chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
      chai
        .expect(res.body.message)
        .to.equal(constants.SUCCESS_UPDATE(entity, 'Updated Expense'));
    });
  });

  // negative PUT test
  describe('PUT /api/expense/:id', () => {
    it('should return a 404 Not Found for an invalid expense ID', async () => {
      const invalidExpenseId = 'invalid_id';

      const updatedExpense = {
        title: 'Updated Expense',
        amount: 75.0,
        category: 'Transportation',
        username: 'user123',
      };

      const res = await chai
        .request(app)
        .put(`/api/expense/${invalidExpenseId}`)
        .send(updatedExpense);

      chai.expect(res).to.have.status(constants.STATUS_CODE_NOT_FOUND);
      chai.expect(res.body.message).to.equal('Expense not found');
    });
  });

  describe('DELETE /api/expense/:id', () => {
    it('should delete an existing expense', async () => {
      const expense = await ExpenseModel.findOne({ title: 'Expense 2' });

      const res = await chai.request(app).delete(`/api/expense/${expense._id}`);

      chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
      chai.expect(res.body.message).to.equal(constants.SUCCESS_DELETE(entity));
    });
  });

  describe('DELETE /api/expense/:id', () => {
    it('should return a 404 Not Found for an invalid expense ID', async () => {
      const invalidExpenseId = 'invalid_id';

      const res = await chai
        .request(app)
        .delete(`/api/expense/${invalidExpenseId}`);

      chai.expect(res).to.have.status(constants.STATUS_CODE_NOT_FOUND);
      chai.expect(res.body.message).to.equal('Expense not found'); // Adjust this message according to your application's response
    });
  });

  after('Disconnect from MongoDB', async () => {
    await mongoose.connection.close();
  });
});
