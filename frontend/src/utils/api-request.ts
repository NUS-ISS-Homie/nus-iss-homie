import axios, { AxiosResponse } from 'axios';

export declare namespace API {
  type Response<T> = {
    status: number;
    statusText: string;
    data: T;
  };
}

const instance = (url: string) =>
  axios.create({
    baseURL: url,
    timeout: 15000,
  });

const responseBody = (response: AxiosResponse) => {
  const res: API.Response<typeof response.data> = {
    status: response.status,
    statusText: response.statusText,
    data: response.data,
  };

  return res;
};

export const requests = {
  get: (base_url: string, url: string, headers = {}) =>
    instance(base_url)
      .get(url, headers)
      .then(responseBody)
      .catch((err) => responseBody(err.response)),

  post: (base_url: string, url: string, body: {}) =>
    instance(base_url)
      .post(url, body)
      .then(responseBody)
      .catch((err) => responseBody(err.response)),

  postWithHeaders: (base_url: string, url: string, body: {}, headers: {}) =>
    instance(base_url)
      .post(url, body, headers)
      .then(responseBody)
      .catch((err) => responseBody(err.response)),

  put: (base_url: string, url: string, body: {}) =>
    instance(base_url)
      .put(url, body)
      .then(responseBody)
      .catch((err) => responseBody(err.response)),

  delete: (base_url: string, url: string, body: {}) =>
    instance(base_url)
      .delete(url, { data: body })
      .then(responseBody)
      .catch((err) => responseBody(err.response)),
};
