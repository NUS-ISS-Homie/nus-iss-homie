import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../index.js';
import mongoose from 'mongoose';
import assert from 'assert';
import 'dotenv/config';

import * as constants from "../common/messages.js";

assert(process.env.ENV == 'TEST');

chai.use(chaiHttp);

describe('MongoDB Connection', () => {
  it('Connect to MongoDB', async function () {
    mongoose.connect(process.env.DB_CLOUD_URI_TEST);
  });
});

const sampleUser = {
  username: 'test',
  password: 'test',
};

const sampleSecondUser = {
  username: 'test2',
  password: 'test2',
};

const sampleUpdatedUsername = {
  username: 'test',
  newUsername: 'newTest',
  password: 'test',
};

const entity = "user";

describe('POST api/user/signup', () => {
  it('should create a new user', function (done) {
    const expectedBody = {
      message: constants.SUCCESS_CREATE(entity, sampleUser.username),
    };

    chai
      .request(app)
      .post(`/api/user/signup`)
      .send(sampleUser)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(constants.STATUS_CODE_CREATED);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
  });

  it('should create a new user 2', function (done) {
    const expectedBody = {
      message: constants.SUCCESS_CREATE(entity, sampleSecondUser.username),
    };

    chai
      .request(app)
      .post(`/api/user/signup`)
      .send(sampleSecondUser)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(constants.STATUS_CODE_CREATED);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
  });
});

describe('POST api/user/login', () => {
  it('should login the user', function (done) {
    const expectedBody = { username: sampleUser.username };

    chai
      .request(app)
      .post(`/api/user/login`)
      .send(sampleUser)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(constants.STATUS_CODE_CREATED);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
  });

  it('should NOT login the user (user does not exist)', function (done) {
    const userDoesNotExistBody = {
      username: 'wrong_username',
      password: 'test',
    };
    const expectedBody = { message: constants.FAIL_NOT_EXIST(entity) };

    chai
      .request(app)
      .post(`/api/user/login`)
      .send(userDoesNotExistBody)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(constants.STATUS_CODE_NOT_FOUND);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
  });

  it('should NOT login the user (wrong password)', function (done) {
    const wrongPasswordBody = {
      username: sampleUser.username,
      password: 'wrong_password',
    };
    const expectedBody = { message: constants.FAIL_INCORRECT_FIELDS };

    chai
      .request(app)
      .post(`/api/user/login`)
      .send(wrongPasswordBody)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(constants.STATUS_CODE_UNAUTHORIZED);
        chai.expect(res.body).deep.equal(expectedBody);
      });
    done();
  });

  it('should NOT login the user (missing fields)', function (done) {
    const missingFieldsBody = {
      username: 'test',
    };
    const expectedBody = { message: constants.FAIL_MISSING_FIELDS };

    chai
      .request(app)
      .post(`/api/user/login`)
      .send(missingFieldsBody)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(constants.STATUS_CODE_BAD_REQUEST);
        chai.expect(res.body).deep.equal(expectedBody);
      });
    done();
  });
});

describe('PUT api/user/change-username', () => {
  it("should NOT change user's username (user does not exist)", function (done) {
    const sampleUpdatedUsername = {
      username: "username_not_exist",
      newUsername: 'newTest',
      password: sampleUser.password,
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
      });
    done();
  });

  it("should NOT change user's username (wrong password)", function (done) {
    const sampleUpdatedUsername = {
      username: sampleUser.username,
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
      });
    done();
  });

  it("should NOT change user's username (Duplicate user)", function (done) {
    const sampleUpdatedUsername = {
      username: sampleSecondUser.username,
      newUsername: 'newTest',
      password: 'test',
    };

    const expectedBody = {
      message: constants.FAIL_DUPLICATE(entity, sampleSecondUser.username),
    };

    chai
      .request(app)
      .put(`/api/user/change-username`)
      .send(sampleUpdatedUsername)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(constants.FAIL_DUPLICATE);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
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
      });
    done();
  });

  it("should change user's username", function (done) {
    const expectedBody = {
      message: constants.SUCCESS_UPDATE(entity, "username"),
    };

    chai
      .request(app)
      .put(`/api/user/change-username`)
      .send(sampleUpdatedUsername)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
  });
});


describe('PUT api/user/change-password', () => {
  it("should NOT change user's password (username does not exist)", function (done) {
    const sampleUpdatedPassword = {
      username: 'username_not_exist',
      newPassword: 'newTest',
      oldPassword: sampleUpdatedUsername.password,
    };

    const expectedBody = {
      message: constants.FAIL_INCORRECT_FIELDS,
    };

    chai
      .request(app)
      .put(`/api/user/change-password`)
      .send(sampleUpdatedPassword)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(constants.STATUS_CODE_NOT_FOUND);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
  });

  it("should NOT change user's password (wrong password)", function (done) {
    const sampleUpdatedPassword = {
      username: sampleUpdatedUsername.username,
      newPassword: 'newTest',
      oldPassword: 'wrong_password',
    };

    const expectedBody = {
      message: constants.FAIL_INCORRECT_FIELDS,
    };

    chai
      .request(app)
      .put(`/api/user/change-password`)
      .send(sampleUpdatedPassword)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(constants.STATUS_CODE_NOT_FOUND);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
  });

  it("should NOT change user's password (Missing fields)", function (done) {
    const sampleUpdatedPassword = {
      username: sampleUpdatedUsername.username,
      oldPassword: 'test',
    };

    const expectedBody = {
      message: constants.FAIL_MISSING_FIELDS,
    };

    chai
      .request(app)
      .put(`/api/user/change-password`)
      .send(sampleUpdatedPassword)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(constants.STATUS_CODE_BAD_REQUEST);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
  });

  it("should change user's password", function (done) {
    const sampleUpdatedPassword = {
      username: sampleUpdatedUsername.username,
      oldPassword: sampleUser.password,
      newPassword: 'newTest',
    };

    const expectedBody = {
      message: constants.SUCCESS_UPDATE(entity, "password"),
    };

    chai
      .request(app)
      .put(`/api/user/change-password`)
      .send(sampleUpdatedPassword)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
  });
});

describe('DELETE /api/user/delete-user', () => {
  it('should NOT delete user (missing username)', function (done) {
    const sampleBody = {
      password: sampleUpdatedUsername.password
    };

    const expectedBody = {
      message: constants.FAIL_MISSING_FIELDS,
    };

    chai
      .request(app)
      .delete(`/api/user/delete-user`)
      .send(sampleBody)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(constants.STATUS_CODE_BAD_REQUEST);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
  });

  it('should NOT delete user (missing password)', function (done) {
    const sampleBody = {
      username: sampleUpdatedUsername.newUsername,
    };

    const expectedBody = {
      message: constants.FAIL_MISSING_FIELDS,
    };

    chai
      .request(app)
      .delete(`/api/user/delete-user`)
      .send(sampleBody)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(constants.STATUS_CODE_BAD_REQUEST);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
  });

  it('should NOT delete user (wrong username)', function (done) {
    const sampleBody = {
      username: 'wrong_username',
      password: sampleUpdatedUsername.password
    };
    const expectedBody = {
      message: constants.FAIL_NOT_EXIST(entity),
    };

    chai
      .request(app)
      .delete(`/api/user/delete-user`)
      .send(sampleBody)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(constants.STATUS_CODE_NOT_FOUND);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
  });

  it('should delete user 1', function (done) {
    const sampleBody = {
      username: sampleUpdatedUsername.newUsername,
      password: sampleUpdatedUsername.password
    };
    const expectedBody = {
      message: constants.SUCCESS_DELETE(entity, sampleUpdatedUsername.newUsername),
    };

    chai
      .request(app)
      .delete(`/api/user/delete-user`)
      .send(sampleBody)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
  });

  it('should delete user 2', function (done) {
    const sampleBody = {
      username: sampleSecondUser.username,
      password: sampleSecondUser.password

    };
    const expectedBody = {
      message: constants.SUCCESS_DELETE(entity, sampleSecondUser.username),
    };

    chai
      .request(app)
      .delete(`/api/user/delete-user`)
      .send(sampleBody)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(constants.STATUS_CODE_OK);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
  });
});