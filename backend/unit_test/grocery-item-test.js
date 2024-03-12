import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
import app from '../index.js';
import mongoose from 'mongoose';
import 'dotenv/config';
import assert from 'assert';
import * as msg from '../common/messages.js';
import { entity } from '../controllers/grocery-item-controller.js';
import GroceryItemModel from '../models/grocery-item/grocery-item-model.js';
import UserModel from '../models/user/user-model.js';

assert(process.env.ENV == 'TEST');
chai.use(chaiHttp);
chai.use(chaiShallowDeepEqual);

// CRUD

describe('CRUD API Grocery Item', () => {
    const groceryItemId = new mongoose.Types.ObjectId().toString();
    const user1 = {
        _id: new mongoose.Types.ObjectId().toString(),
        username: 'user1',
    };
    const user2 = {
        _id: new mongoose.Types.ObjectId().toString(),
        username: 'user2',
    };
    const groceryItem1 = {
        _id: groceryItemId.toString(),
        user: user1._id.toString(),
        name: 'milk',
        purchasedDate: new Date(),
        expiryDate: new Date(),
        quantity: 2,
        unit: 'L',
        category: 'Dairy/Eggs'
    };

    before('Connect to MongoDB', async () => {
        await mongoose.connect(process.env.DB_CLOUD_URI_TEST);
    });

    beforeEach('Clear DB', async () => {
        // Create Users
        await UserModel.deleteMany();
        await UserModel.create({ ...user1, hashedPassword: 'password' });
        await UserModel.create({ ...user2, hashedPassword: 'password' });

        // Create Notification
        await GroceryItemModel.deleteMany();
        await GroceryItemModel.create(groceryItem1);
    });

    describe('POST api/grocery-item', () => {
        it('should create a new notification', (done) => {
            const newItem = {
                user: user2._id,
                name: 'banana',
                purchasedDate: new Date(),
                expiryDate: new Date(),
                quantity: 3,
                unit: 'pcs',
                category: 'Fruits'
            }

            const expectedBody = {
                message: msg.SUCCESS_CREATE(entity),
                item: newItem,
            };

            chai
                .request(app)
                .post('/api/grocery-item')
                .send(newItem)
                .end((err, res) => {
                    err && console.log(err);
                    chai.expect(res).to.have.status(msg.STATUS_CODE_CREATED);
                    chai.expect(res.body).to.shallowDeepEqual(expectedBody);
                    done();
                });
        });

        it('should not create a new grocery item (missing field)', (done) => {
            const newItem = {
                user: new mongoose.Types.ObjectId().toString(),
                name: 'banana',
                purchasedDate: new Date(),
                // expiryDate: new Date(),
                quantity: 3,
                unit: 'pcs',
                category: 'Fruits'
            }
            const expectedBody = { message: msg.FAIL_MISSING_FIELDS };

            chai
                .request(app)
                .post('/api/grocery-item')
                .send(newItem)
                .end((err, res) => {
                    err && console.log(err);
                    chai.expect(res).to.have.status(msg.STATUS_CODE_BAD_REQUEST);
                    chai.expect(res.body).to.shallowDeepEqual(expectedBody);
                    done();
                });
        });
    });

    describe('GET api/grocery-item/:groceryItemId (by recipient)', () => {
        it('should obtain an existing grocery item data', (done) => {
            const expectedBody = {
                message: msg.SUCCESS_READ(entity),
                item: groceryItem1,
            };

            chai
                .request(app)
                .get(`/api/grocery-item/${groceryItem1._id}`)
                .send()
                .end((err, res) => {
                    err && console.log(err);
                    chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
                    chai.expect(res.body).to.shallowDeepEqual(expectedBody);
                    done();
                });
        });
    });


    // TODO : Create tests for update 

    describe('DELETE api/grocery-item/:groceryItemId', () => {
        it('should delete an existing grocery item', (done) => {
            const expectedBody = { message: msg.SUCCESS_DELETE(entity) };

            chai
                .request(app)
                .delete(`/api/grocery-item/${groceryItem1._id}`)
                .end((err, res) => {
                    err && console.log(err);
                    chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
                    chai.expect(res.body).to.shallowDeepEqual(expectedBody);
                    done();
                });
        });

        it('should not delete an existing grocery item (missing groceryItemId)', (done) => {
            const expectedBody = { message: msg.FAIL_MISSING_FIELDS };

            chai
                .request(app)
                .delete(`/api/grocery-item`)
                .send()
                .end((err, res) => {
                    err && console.log(err);
                    chai.expect(res).to.have.status(msg.STATUS_CODE_BAD_REQUEST);
                    chai.expect(res.body).to.shallowDeepEqual(expectedBody);
                    done();
                });
        });
    });
});
