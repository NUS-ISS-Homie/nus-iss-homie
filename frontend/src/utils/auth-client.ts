import {
    URL_USER_SVC,
    USER_CHANGE_PASSWORD,
    USER_CHANGE_USERNAME,
    USER_DELETE_USER,
    USER_LOGIN,
    USER_LOGOUT,
    USER_SIGNUP,
  } from '../configs';
  import { requests, API } from './api-request';
  
  export const AuthClient = {
    signUp: (body: {
      username: string;
      password: string;
    }): Promise<API.Response<{ message: string }>> =>
      requests.post(URL_USER_SVC, USER_SIGNUP, body),
  
    login: (body: {
      username: string;
      password: string;
    }): Promise<
      API.Response<{
        username: string;
        token: string;
        user_id: string;
        message: string;
      }>
    > => requests.post(URL_USER_SVC, USER_LOGIN, body),
  
    logout: (body: {
      username: string;
    }): Promise<API.Response<{ message: string }>> => {
      return requests.post(URL_USER_SVC, USER_LOGOUT, body);
    },
  
    changeUsername: (body: {
      username: string;
      newUsername: string;
      password: string;
    }): Promise<API.Response<{ message: string }>> => {
      const headers = {
        'Content-Type': 'application/json',
      };
      return requests.postWithHeaders(URL_USER_SVC, USER_CHANGE_USERNAME, body, {
        headers: headers,
      });
    },
  
    changePassword: (body: {
      username: string;
      oldPassword: string;
      newPassword: string;
    }): Promise<API.Response<{ message: string }>> => {
      const headers = {
        'Content-Type': 'application/json',
      };
      return requests.postWithHeaders(URL_USER_SVC, USER_CHANGE_PASSWORD, body, {
        headers: headers,
      });
    },
  
    deleteUser: (data: {
      username: string;
    }): Promise<API.Response<{ message: string }>> => {
      return requests.delete(URL_USER_SVC, USER_DELETE_USER, { data });
    },
  };