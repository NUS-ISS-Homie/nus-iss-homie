import bcrypt from 'bcrypt';
import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
import mongoose from 'mongoose';
import assert from 'assert';
import 'dotenv/config';

import * as constants from '../common/messages.js';
import { entity } from '../controllers/user-controller.js';
import UserModel from '../models/user/user-model.js';
import app from '../index.js';

assert(process.env.ENV == 'TEST');
const saltRounds = parseInt(process.env.SALT_ROUNDS);

chai.use(chaiHttp);
chai.use(chaiShallowDeepEqual);

describe('User API CRUD', () => {
  const user1 = {
    username: 'user1',
    password: 'test1',
  };

  const user2 = {
    username: 'user2',
    password: 'test2',
  };

  before('Connect to MongoDB', async () => {
    await mongoose.connect(process.env.DB_CLOUD_URI_TEST);
  });

  beforeEach('Clear DB', async () => {
    await UserModel.deleteMany();
    const u1 = await UserModel.create({
      username: user1.username,
      hashedPassword: await bcrypt.hash(user1.password, saltRounds),
    });
    const u2 = await UserModel.create({
      username: user2.username,
      hashedPassword: await bcrypt.hash(user2.password, saltRounds),
    });
    console.log(u1.username, u2.username);
    return u1 && u2;
  });

  describe('POST api/user/signup', () => {
    const newUser = { username: 'newUser', password: 'test' };

    it('should create a new user', function (done) {
      const expectedBody = {
        message: constants.SUCCESS_CREATE(entity, newUser.username),
      };

      chai
        .request(app)
        .post(`/api/user/signup`)
        .send(newUser)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_CREATED);
          chai.expect(res.body).to.deep.equal(expectedBody);
          done();
        });
    });
  });

  describe('POST api/user/login', () => {
    it('should login the user', function (done) {
      const expectedBody = { username: user1.username };

      chai
        .request(app)
        .get(`/api/user/login`)
        .send(user1)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
          chai.expect(res.body).to.shallowDeepEqual(expectedBody);
          done();
        });
    });
    it('should NOT login the user (user does not exist)', function (done) {
      const nonExistentUser = {
        username: 'wrong_username',
        password: user1.password,
      };

      const expected = { message: constants.FAIL_NOT_EXIST(entity) };

      chai
        .request(app)
        .get(`/api/user/login`)
        .send(nonExistentUser)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_NOT_FOUND);
          chai.expect(res.body).to.deep.equal(expected);
          done();
        });
    });

    it('should NOT login the user (wrong password)', function (done) {
      const wrongPasswordBody = {
        username: user1.username,
        password: 'wrong_password',
      };

      const expected = { message: constants.FAIL_UNAUTHORIZED };

      chai
        .request(app)
        .get(`/api/user/login`)
        .send(wrongPasswordBody)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_UNAUTHORIZED);
          chai.expect(res.body).shallowDeepEqual(expected);
          done();
        });
    });

    it('should NOT login the user (missing fields)', function (done) {
      const missingFieldsBody = { username: user1.username };
      const expectedBody = { message: constants.FAIL_MISSING_FIELDS };

      chai
        .request(app)
        .get(`/api/user/login`)
        .send(missingFieldsBody)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_BAD_REQUEST);
          chai.expect(res.body).shallowDeepEqual(expectedBody);
          done();
        });
    });
  });

  describe('PUT api/user/change-username', () => {
    it("should NOT change user's username (user does not exist)", function (done) {
      const sampleUpdatedUsername = {
        username: 'username_not_exist',
        newUsername: 'newTest',
        password: user1.password,
      };

      const expectedBody = {
        message: constants.FAIL_INCORRECT_FIELDS,
      };

      chai
        .request(app)
        .put(`/api/user/change-username`)
        .send(sampleUpdatedUsername)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_BAD_REQUEST);
          chai.expect(res.body).to.deep.equal(expectedBody);
          done();
        });
    });

    it("should NOT change user's username (wrong password)", function (done) {
      const sampleUpdatedUsername = {
        username: user1.username,
        newUsername: 'newTest',
        password: 'wrong_password',
      };

      const expectedBody = {
        message: constants.FAIL_INCORRECT_FIELDS,
      };

      chai
        .request(app)
        .put(`/api/user/change-username`)
        .send(sampleUpdatedUsername)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_UNAUTHORIZED);
          chai.expect(res.body).to.deep.equal(expectedBody);
          done();
        });
    });

    it("should NOT change user's username (Duplicate user)", function (done) {
      const sampleUpdatedUsername = {
        username: user1.username,
        newUsername: user2.username,
        password: user1.password,
      };

      const expected = {
        message: constants.FAIL_DUPLICATE(entity, user1.username),
      };

      chai
        .request(app)
        .put(`/api/user/change-username`)
        .send(sampleUpdatedUsername)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_DUPLICATE);
          chai.expect(res.body).to.deep.equal(expected);
          done();
        });
    });

    it("should NOT change user's username (Missing fields)", function (done) {
      const sampleUpdatedUsername = {
        newUsername: 'newTest',
        password: 'test',
      };

      const expectedBody = {
        message: constants.FAIL_MISSING_FIELDS,
      };

      chai
        .request(app)
        .put(`/api/user/change-username`)
        .send(sampleUpdatedUsername)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_BAD_REQUEST);
          chai.expect(res.body).to.deep.equal(expectedBody);
          done();
        });
    });

    it("should change user's username", function (done) {
      const updated = {
        username: user1.username,
        newUsername: `${user1.username}-new`,
        password: user1.password,
      };

      const expected = {
        message: constants.SUCCESS_UPDATE(entity, 'username'),
      };

      chai
        .request(app)
        .put(`/api/user/change-username`)
        .send(updated)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
          chai.expect(res.body).to.deep.equal(expected);
          done();
        });
    });
  });

  describe('PUT api/user/change-password', () => {
    it("should NOT change user's password (username does not exist)", function (done) {
      const updated = {
        username: 'username_not_exist',
        newPassword: 'newTest',
        oldPassword: user1.password,
      };

      const expected = { message: constants.FAIL_INCORRECT_FIELDS };

      chai
        .request(app)
        .put(`/api/user/change-password`)
        .send(updated)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_BAD_REQUEST);
          chai.expect(res.body).to.deep.equal(expected);
          done();
        });
    });

    it("should NOT change user's password (wrong password)", function (done) {
      const sampleUpdatedPassword = {
        username: user1.username,
        newPassword: 'newTest',
        oldPassword: 'wrong_password',
      };

      const expected = { message: constants.FAIL_UNAUTHORIZED };

      chai
        .request(app)
        .put(`/api/user/change-password`)
        .send(sampleUpdatedPassword)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_UNAUTHORIZED);
          chai.expect(res.body).to.deep.equal(expected);
          done();
        });
    });

    it("should NOT change user's password (Missing fields)", function (done) {
      const updated = { ...user1 };

      const expected = { message: constants.FAIL_MISSING_FIELDS };

      chai
        .request(app)
        .put(`/api/user/change-password`)
        .send(updated)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_BAD_REQUEST);
          chai.expect(res.body).to.deep.equal(expected);
          done();
        });
    });

    it("should change user's password", function (done) {
      const updated = {
        username: user1.username,
        oldPassword: user1.password,
        newPassword: 'newTest',
      };

      const expected = {
        message: constants.SUCCESS_UPDATE(entity, 'password'),
      };

      chai
        .request(app)
        .put(`/api/user/change-password`)
        .send(updated)
        .end((err, res) => {
          err && console.log(err);
          chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
          chai.expect(res.body).to.deep.equal(expected);
          done();
        });
    });
  });

  // describe('DELETE /api/user/delete-user', () => {
  //   it('should NOT delete user (missing username)', function (done) {
  //     const sampleBody = {
  //       password: sampleUpdatedUsername.password,
  //     };

  //     const expectedBody = {
  //       message: constants.FAIL_MISSING_FIELDS,
  //     };

  //     chai
  //       .request(app)
  //       .delete(`/api/user/delete-user`)
  //       .send(sampleBody)
  //       .end((err, res) => {
  //         err && console.log(err);
  //         chai.expect(res).to.have.status(constants.STATUS_CODE_BAD_REQUEST);
  //         chai.expect(res.body).to.deep.equal(expectedBody);
  //         done();
  //       });
  //   });

  //   it('should NOT delete user (missing password)', function (done) {
  //     const sampleBody = {
  //       username: sampleUpdatedUsername.newUsername,
  //     };

  //     const expectedBody = {
  //       message: constants.FAIL_MISSING_FIELDS,
  //     };

  //     chai
  //       .request(app)
  //       .delete(`/api/user/delete-user`)
  //       .send(sampleBody)
  //       .end((err, res) => {
  //         err && console.log(err);
  //         chai.expect(res).to.have.status(constants.STATUS_CODE_BAD_REQUEST);
  //         chai.expect(res.body).to.deep.equal(expectedBody);
  //         done();
  //       });
  //   });

  //   it('should NOT delete user (wrong username)', function (done) {
  //     const sampleBody = {
  //       username: 'wrong_username',
  //       password: sampleUpdatedUsername.password,
  //     };
  //     const expectedBody = {
  //       message: constants.FAIL_NOT_EXIST(entity),
  //     };

  //     chai
  //       .request(app)
  //       .delete(`/api/user/delete-user`)
  //       .send(sampleBody)
  //       .end((err, res) => {
  //         err && console.log(err);
  //         chai.expect(res).to.have.status(constants.STATUS_CODE_NOT_FOUND);
  //         chai.expect(res.body).to.deep.equal(expectedBody);
  //         done();
  //       });
  //   });

  //   it('should delete user 1', function (done) {
  //     const sampleBody = {
  //       username: sampleUpdatedUsername.newUsername,
  //       password: sampleUpdatedUsername.password,
  //     };
  //     const expectedBody = {
  //       message: constants.SUCCESS_DELETE(
  //         entity,
  //         sampleUpdatedUsername.newUsername
  //       ),
  //     };

  //     chai
  //       .request(app)
  //       .delete(`/api/user/delete-user`)
  //       .send(sampleBody)
  //       .end((err, res) => {
  //         err && console.log(err);
  //         chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
  //         chai.expect(res.body).to.deep.equal(expectedBody);
  //         done();
  //       });
  //   });

  //   it('should delete user 2', function (done) {
  //     const sampleBody = {
  //       username: sampleSecondUser.username,
  //       password: sampleSecondUser.password,
  //     };
  //     const expectedBody = {
  //       message: constants.SUCCESS_DELETE(entity, sampleSecondUser.username),
  //     };

  //     chai
  //       .request(app)
  //       .delete(`/api/user/delete-user`)
  //       .send(sampleBody)
  //       .end((err, res) => {
  //         err && console.log(err);
  //         chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
  //         chai.expect(res.body).to.deep.equal(expectedBody);
  //         done();
  //       });
  //   });
  // });
});
