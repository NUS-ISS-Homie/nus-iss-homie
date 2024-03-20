import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
import app from '../index.js';
import mongoose from 'mongoose';
import 'dotenv/config';
import assert from 'assert';
import * as msg from '../common/messages.js';
import { entity } from '../controllers/home-controller.js';
import HomeModel from '../models/home/home-model.js';
import UserModel from '../models/user/user-model.js';
import groceryItemModel from '../models/grocery-item/grocery-item-model';
import groceryListModel from '../models/grocery-list/grocery-list-model';

assert(process.env.ENV == 'TEST');
chai.use(chaiHttp);
chai.use(chaiShallowDeepEqual);
import mongoose from "mongoose";

describe('Grocery List CRUD API', () => {
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
    const groceryListId = new mongoose.Types.ObjectId().toString();

    const item1 = {
        _id: new mongoose.Types.ObjectId().toString(),
        user: user1._id,
        name: 'Milk',
        purchasedDate: new Date(),
        expirtyDate: new Date(),
        quantity: 2,
        unit: 'L',
        category: 'Dairy/Eggs'
    }
    const item2 = {
        _id: new mongoose.Types.ObjectId().toString(),
        user: user2._id,
        name: 'Chicken Breast',
        purchasedDate: new Date(),
        expirtyDate: new Date(),
        quantity: 500,
        unit: 'gr',
        category: 'Meat'
    }

    const groceryList = {
        _id: groceryListId,
        home: homeId,
        users: [user1._id, user2._id]
    }

    before('Connect to MongoDB', async () => {
        await mongoose.connect(process.env.DB_CLOUD_URI_TEST);
    });

    beforeEach('Clear DB', async () => {
        // Create Users, Home, and Grocery Items
        await UserModel.deleteMany();
        await UserModel.create({ ...adminUser, hashedPassword: 'password' });
        await UserModel.create({ ...user1, hashedPassword: 'password' });
        await UserModel.create({ ...user2, hashedPassword: 'password' });

        await HomeModel.deleteMany();
        await HomeModel.create({
            _id: homeId,
            adminUser: adminUser._id,
            users: [user1._id, user2._id],
        });

        await groceryItemModel.deleteMany();
        await groceryItemModel.create({ ...item1 });
        await groceryItemModel.create({ ...item2 });

        await groceryListModel.deleteMany();
    });

    describe('POST api/grocery-list', () => {
        it('should create a new grocery list', (done) => {
            const expectedBody = {
                message: msg.SUCCESS_CREATE(entity),
                list: {
                    _id: groceryList._id,
                    home: groceryList.home,
                    users: []
                },
            };

            chai
                .request(app)
                .post('/api/grocery-list')
                .send({
                    _id: groceryList._id,
                    home: groceryList.home,
                })
                .end((err, res) => {
                    err && console.log(err);
                    chai.expect(res).to.have.status(msg.STATUS_CODE_CREATED);
                    chai.expect(res.body).to.shallowDeepEqual(expectedBody);
                    done();
                });
        });

        it('should not create a new list (missing homeId)', (done) => {
            const expectedBody = { message: msg.FAIL_MISSING_FIELDS };

            chai
                .request(app)
                .post('/api/grocery-list')
                .send({
                    _id: groceryList._id,
                })
                .end((err, res) => {
                    err && console.log(err);
                    chai.expect(res).to.have.status(msg.STATUS_CODE_BAD_REQUEST);
                    chai.expect(res.body).to.shallowDeepEqual(expectedBody);
                    done();
                });
        });
    });

    describe('GET api/grocery-list (by homeId)', () => {
        it('should obtain an existing list data', (done) => {
            const expectedBody = {
                message: msg.SUCCESS_READ(entity),
                list: {
                    _id: groceryList._id,
                    home: groceryList.home,
                    users: []
                },
            };

            chai
                .request(app)
                .get(`/api/grocery-list/${homeId}`)
                .send()
                .end((err, res) => {
                    err && console.log(err);
                    chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
                    chai.expect(res.body).to.shallowDeepEqual(expectedBody);
                    done();
                });
        });

        it('should not obtain an existing grocery list data (missing homeId)', (done) => {
            const expectedBody = { message: msg.FAIL_MISSING_FIELDS };

            chai
                .request(app)
                .put(`/api/grocery-list`)
                .send()
                .end((err, res) => {
                    err && console.log(err);
                    chai.expect(res).to.have.status(msg.STATUS_CODE_BAD_REQUEST);
                    chai.expect(res.body).to.shallowDeepEqual(expectedBody);
                    done();
                });
        });
    });

    describe('PUT api/grocery-list/:homeId/add', () => {
        it('should add item to an existing list', (done) => {
            const expectedList = {
                _id: groceryList._id,
                home: groceryList.home,
                items: [item1]
            };

            chai
                .request(app)
                .put(`/api/grocery-list/${homeId}/add`)
                .send({ itemId: item1._id })
                .end((err, res) => {
                    err && console.log(err);
                    chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
                    chai
                        .expect(res.body.message)
                        .to.equal(msg.SUCCESS_ACTION('added to', entity));
                    chai.expect(res.body.home).to.shallowDeepEqual(expectedList);
                    done();
                });
        });

        it('should not add to an existing list (missing itemId)', (done) => {
            const expectedBody = { message: msg.FAIL_MISSING_FIELDS };

            chai
                .request(app)
                .put(`/api/grocery-list/${homeId}/add`)
                .send()
                .end((err, res) => {
                    err && console.log(err);
                    chai.expect(res).to.have.status(msg.STATUS_CODE_BAD_REQUEST);
                    chai.expect(res.body).to.shallowDeepEqual(expectedBody);
                    done();
                });
        });

        it('should not added to list (inexistent list)', (done) => {
            const randomId = new mongoose.Types.ObjectId();
            const expectedBody = { message: msg.FAIL_NOT_EXIST(entity) };

            chai
                .request(app)
                .put(`/api/grocery-list/${randomId}/add`)
                .send({ itemId: item2._id })
                .end((err, res) => {
                    err && console.log(err);
                    chai.expect(res).to.have.status(msg.STATUS_CODE_NOT_FOUND);
                    chai.expect(res.body).to.shallowDeepEqual(expectedBody);
                    done();
                });
        });
    });

    describe('PUT api/grocery-list', () => {
        it('should obtain an existing list data', (done) => {
            const expectedBody = {
                message: msg.SUCCESS_READ(entity),
                list: {
                    _id: groceryList._id,
                    home: groceryList.home,
                    items: [item1]
                }
            };

            chai
                .request(app)
                .get(`/api/grocery-list/`)
                .send({ listId: groceryListId })
                .end((err, res) => {
                    err && console.log(err);
                    chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
                    chai.expect(res.body).to.shallowDeepEqual(expectedBody);
                    done();
                });
        });
    });

    describe('PUT api/grocery-list/:homeId/remove', () => {
        it('should remove from an existing list', (done) => {
            const expectedBody = { message: msg.SUCCESS_ACTION('removed from', entity) };

            chai
                .request(app)
                .put(`/api/grocery-list/${homeId}/remove`)
                .send({ itemId: user1._id })
                .end((err, res) => {
                    err && console.log(err);
                    chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
                    chai.expect(res.body).to.shallowDeepEqual(expectedBody);
                    chai.expect(res.body.home.items).to.not.contain(user1._id);
                    done();
                });
        });

        it('should not remove from an existing list (missing itemId)', (done) => {
            const expectedBody = { message: msg.FAIL_MISSING_FIELDS };

            chai
                .request(app)
                .put(`/api/grocery-list/${homeId}/remove`)
                .send()
                .end((err, res) => {
                    err && console.log(err);
                    chai.expect(res).to.have.status(msg.STATUS_CODE_BAD_REQUEST);
                    chai.expect(res.body).to.shallowDeepEqual(expectedBody);
                    done();
                });
        });

        it('should not remove from an existing list (list does not exist)', (done) => {
            const expectedBody = { message: msg.FAIL_NOT_EXIST };

            chai
                .request(app)
                .put(`/api/grocery-list/${homeId}/remove`)
                .send({ userId: user1._id })
                .end((err, res) => {
                    err && console.log(err);
                    chai.expect(res).to.have.status(msg.STATUS_CODE_NOT_FOUND);
                    chai.expect(res.body).to.shallowDeepEqual(expectedBody);
                    done();
                });
        });
    });

    describe('DELETE api/grocery-list', () => {
        const randomId = new mongoose.Types.ObjectId().toString();

        it('should delete an existing list', (done) => {
            const expectedBody = { message: msg.SUCCESS_DELETE(entity) };

            chai
                .request(app)
                .delete(`/api/grocery-list`)
                .send({ listId: groceryListId })
                .end((err, res) => {
                    err && console.log(err);
                    chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
                    chai.expect(res.body).to.shallowDeepEqual(expectedBody);
                    done();
                });
        });

        it('should not delete an existing list (listId does not exist)', (done) => {
            const expectedBody = { message: msg.FAIL_NOT_EXIST };

            chai
                .request(app)
                .delete(`/api/grocery-list`)
                .send({ listId: randomId })
                .end((err, res) => {
                    err && console.log(err);
                    chai.expect(res).to.have.status(msg.STATUS_CODE_NOT_FOUND);
                    chai.expect(res.body).to.shallowDeepEqual(expectedBody);
                    done();
                });
        });
    });
});
