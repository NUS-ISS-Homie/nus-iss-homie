import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
import app from '../index.js';
import mongoose from 'mongoose';
import 'dotenv/config';
import assert from 'assert';
import * as msg from '../common/messages.js';
import { entity } from '../controllers/grocery-list-controller.js';
import HomeModel from '../models/home/home-model.js';
import UserModel from '../models/user/user-model.js';
import groceryItemModel from '../models/grocery-item/grocery-item-model.js';
import groceryListModel from '../models/grocery-list/grocery-list-model.js';

assert(process.env.ENV == 'TEST');
chai.use(chaiHttp);
chai.use(chaiShallowDeepEqual);

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
  const homeId2 = new mongoose.Types.ObjectId().toString();
  const homeId3 = new mongoose.Types.ObjectId().toString();
  const groceryListId = new mongoose.Types.ObjectId().toString();

  const item1 = {
    _id: new mongoose.Types.ObjectId().toString(),
    user: user1._id,
    name: 'Milk',
    purchasedDate: new Date(),
    expiryDate: new Date(),
    quantity: 2,
    unit: 'L',
    category: 'Dairy/Eggs',
  };
  const item2 = {
    _id: new mongoose.Types.ObjectId().toString(),
    user: user2._id,
    name: 'Chicken Breast',
    purchasedDate: new Date(),
    expiryDate: new Date(),
    quantity: 500,
    unit: 'gr',
    category: 'Meat',
  };

  const item3 = {
    _id: new mongoose.Types.ObjectId().toString(),
    user: user1._id,
    name: 'Salmon',
    purchasedDate: new Date(),
    expiryDate: new Date(),
    quantity: 1,
    unit: 'kg',
    category: 'Fish',
  };

  const groceryList = {
    _id: groceryListId,
    home: homeId,
    items: [item1._id, item2._id],
  };

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

    await HomeModel.create({
      _id: homeId2,
      adminUser: user1._id,
      users: [user1._id, user2._id],
    });

    await HomeModel.create({
      _id: homeId3,
      adminUser: user2._id,
      users: [user1._id, user2._id],
    });

    await groceryItemModel.deleteMany();
    await groceryItemModel.create({ ...item1 });
    await groceryItemModel.create({ ...item2 });
    await groceryItemModel.create({ ...item3 });

    await groceryListModel.deleteMany();
    await groceryListModel.create({
      _id: groceryListId,
      home: homeId,
      items: [item1._id, item2._id],
    });
  });

  describe('POST api/grocery-list', () => {
    it('should create a new grocery list', (done) => {
      const expectedBody = {
        message: msg.SUCCESS_CREATE(entity),
        list: {
          homeId: homeId2,
          items: [],
        },
      };

      chai
        .request(app)
        .post('/api/grocery-list')
        .send({
          homeId: homeId2,
        })
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_CREATED);
          chai
            .expect(res.body.list.home._id)
            .to.shallowDeepEqual(expectedBody.list.homeId);
          chai
            .expect(res.body.list.items)
            .to.shallowDeepEqual(expectedBody.list.items);
          done();
        });
    });
  });

  describe('GET api/grocery-list (by homeId)', () => {
    it('should obtain an existing list data', (done) => {
      const expectedBody = {
        message: msg.SUCCESS_READ(entity),
        list: groceryList,
      };

      chai
        .request(app)
        .get(`/api/grocery-list/${homeId}`)
        .send()
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
          chai
            .expect(res.body.list.home._id)
            .to.shallowDeepEqual(expectedBody.list.home);
          chai
            .expect(res.body.list._id)
            .to.shallowDeepEqual(expectedBody.list._id);
          chai
            .expect(res.body.list.items[0]._id)
            .to.shallowDeepEqual(expectedBody.list.items[0]);
          chai
            .expect(res.body.list.items[1]._id)
            .to.shallowDeepEqual(expectedBody.list.items[1]);
          done();
        });
    });
  });

  describe('PUT api/grocery-list', () => {
    it('should obtain an existing list data', (done) => {
      const expectedBody = {
        message: msg.SUCCESS_READ(entity),
        list: groceryList,
      };

      chai
        .request(app)
        .put(`/api/grocery-list/`)
        .send({ listId: groceryListId })
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
          chai
            .expect(res._body.list.home._id)
            .to.shallowDeepEqual(expectedBody.list.home);
          chai
            .expect(res._body.list._id)
            .to.shallowDeepEqual(expectedBody.list._id);
          chai
            .expect(res._body.list.items[0]._id)
            .to.shallowDeepEqual(expectedBody.list.items[0]);
          chai
            .expect(res._body.list.items[1]._id)
            .to.shallowDeepEqual(expectedBody.list.items[1]);
          done();
        });
    });

    it('should not obtain an existing grocery list data (missing listId)', (done) => {
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
        items: [item1._id, item2._id, item3._id],
      };

      chai
        .request(app)
        .put(`/api/grocery-list/${homeId}/add`)
        .send({ itemId: item3._id })
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
          chai
            .expect(res.body.message)
            .to.equal(msg.SUCCESS_ACTION('added to', entity));
          chai
            .expect(res.body.list.home._id)
            .to.shallowDeepEqual(expectedList.home);
          chai.expect(res.body.list._id).to.shallowDeepEqual(expectedList._id);
          chai
            .expect(res.body.list.items[0]._id)
            .to.shallowDeepEqual(expectedList.items[0]);
          chai
            .expect(res.body.list.items[1]._id)
            .to.shallowDeepEqual(expectedList.items[1]);
          chai
            .expect(res.body.list.items[2]._id)
            .to.shallowDeepEqual(expectedList.items[2]);
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

    it('should add to list (inexistent list)', (done) => {
      chai
        .request(app)
        .put(`/api/grocery-list/${homeId3}/add`)
        .send({ itemId: item2._id })
        .end((err, res) => {
          err && console.log(err);
          console.log(res.body.list.items);
          chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
          chai.expect(res.body.list.home._id).to.shallowDeepEqual(homeId3);
          chai
            .expect(res.body.list.items[0]._id)
            .to.shallowDeepEqual(item2._id);
          done();
        });
    });
  });

  describe('PUT api/grocery-list/:homeId/remove', () => {
    it('should remove from an existing list', (done) => {
      const expectedBody = {
        message: msg.SUCCESS_ACTION('removed from', entity),
      };

      chai
        .request(app)
        .put(`/api/grocery-list/${homeId}/remove`)
        .send({ itemId: item2._id })
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          chai.expect(res.body.list.items).to.not.contain(item2._id);
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
      const randomId = new mongoose.Types.ObjectId().toString();
      chai
        .request(app)
        .put(`/api/grocery-list/${randomId}/remove`)
        .send({ itemId: item1._id })
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
        .send({ homeId: homeId })
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_OK);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });

    it('should not delete an existing list (list with homeId does not exist)', (done) => {
      const expectedBody = { message: msg.FAIL_NOT_EXIST };

      chai
        .request(app)
        .delete(`/api/grocery-list`)
        .send({ homeId: randomId })
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(msg.STATUS_CODE_NOT_FOUND);
          chai
            .expect(res.body.message)
            .to.shallowDeepEqual(expectedBody.message);
          done();
        });
    });
  });
});
