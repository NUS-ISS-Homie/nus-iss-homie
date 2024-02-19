import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../index.js';
import mongoose from 'mongoose';
import assert from 'assert';
import 'dotenv/config';

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

describe('POST api/user/signup', () => {
  it('should create a new user', function (done) {
    const expectedBody = {
      message: `Created new user ${sampleUser.username} successfully!`,
    };

    chai
      .request(app)
      .post(`/api/user/signup`)
      .send(sampleUser)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(201);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
  });

  it('should create a new user 2', function (done) {
    const expectedBody = {
      message: `Created new user ${sampleSecondUser.username} successfully!`,
    };

    chai
      .request(app)
      .post(`/api/user/signup`)
      .send(sampleSecondUser)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(201);
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
        chai.expect(res).to.have.status(201);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
  });

  it('should NOT login the user (user does not exist)', function (done) {
    const userDoesNotExistBody = {
      username: 'wrong_username',
      password: 'test',
    };
    const expectedBody = { message: 'User does not exist' };

    chai
      .request(app)
      .post(`/api/user/login`)
      .send(userDoesNotExistBody)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(404);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
  });

  it('should NOT login the user (wrong password)', function (done) {
    const wrongPasswordBody = {
      username: sampleUser.username,
      password: 'wrong_password',
    };
    const expectedBody = { message: 'Wrong password' };

    chai
      .request(app)
      .post(`/api/user/login`)
      .send(wrongPasswordBody)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(404);
        chai.expect(res.body).deep.equal(expectedBody);
      });
    done();
  });

  it('should NOT login the user (missing fields)', function (done) {
    const missingFieldsBody = {
      username: 'test',
    };
    const expectedBody = { message: 'Username and/or Password are missing!' };

    chai
      .request(app)
      .post(`/api/user/login`)
      .send(missingFieldsBody)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(400);
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
      message: `Username and/or Password are incorrect!`,
    };

    chai
      .request(app)
      .put(`/api/user/change-username`)
      .send(sampleUpdatedUsername)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(404);
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
      message: `Username and/or Password are incorrect!`,
    };

    chai
      .request(app)
      .put(`/api/user/change-username`)
      .send(sampleUpdatedUsername)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(404);
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
      message: `User ${sampleSecondUser.username} already exists`,
    };

    chai
      .request(app)
      .put(`/api/user/change-username`)
      .send(sampleUpdatedUsername)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(409);
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
      message: `Missing field(s)!`,
    };

    chai
      .request(app)
      .put(`/api/user/change-username`)
      .send(sampleUpdatedUsername)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(400);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
  });

  it("should change user's username", function (done) {
    const expectedBody = {
      message: `Successfully changed username.`,
    };

    chai
      .request(app)
      .put(`/api/user/change-username`)
      .send(sampleUpdatedUsername)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(200);
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
      message: `Wrong password!`,
    };

    chai
      .request(app)
      .put(`/api/user/change-password`)
      .send(sampleUpdatedPassword)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(404);
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
      message: `Wrong password!`,
    };

    chai
      .request(app)
      .put(`/api/user/change-password`)
      .send(sampleUpdatedPassword)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(404);
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
      message: `Missing field(s)!`,
    };

    chai
      .request(app)
      .put(`/api/user/change-password`)
      .send(sampleUpdatedPassword)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(400);
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
      message: `Successfully changed password.`,
    };

    chai
      .request(app)
      .put(`/api/user/change-password`)
      .send(sampleUpdatedPassword)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(200);
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
      message: `Missing field(s)!`,
    };

    chai
      .request(app)
      .delete(`/api/user/delete-user`)
      .send(sampleBody)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(400);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
  });

  it('should NOT delete user (missing password)', function (done) {
    const sampleBody = {
      username: sampleUpdatedUsername.newUsername,
    };

    const expectedBody = {
      message: `Missing field(s)!`,
    };

    chai
      .request(app)
      .delete(`/api/user/delete-user`)
      .send(sampleBody)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(400);
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
      message: `User does not exist!`,
    };

    chai
      .request(app)
      .delete(`/api/user/delete-user`)
      .send(sampleBody)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(404);
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
      message: `Successfully deleted user.`,
    };

    chai
      .request(app)
      .delete(`/api/user/delete-user`)
      .send(sampleBody)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(200);
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
      message: `Successfully deleted user.`,
    };

    chai
      .request(app)
      .delete(`/api/user/delete-user`)
      .send(sampleBody)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
  });
});