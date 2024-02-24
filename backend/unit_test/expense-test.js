import bcrypt from 'bcrypt';
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
        username: 'user123',
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

  // Add more test cases for other CRUD operations (GET, PUT, DELETE) as needed

  after('Disconnect from MongoDB', async () => {
    await mongoose.connection.close();
  });
});
