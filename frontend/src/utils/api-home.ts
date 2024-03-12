import { HomeResponse } from '../@types/HomeContext';
import { URL_HOME_SVC } from '../configs';
import { API, requests } from './api-request';

const APIHome = {
  createHome: (adminUser: string): Promise<API.Response<HomeResponse>> => {
    return requests.post(URL_HOME_SVC, '', { adminUser });
  },

  getHome: (homeId: string): Promise<API.Response<HomeResponse>> => {
    return requests.get(URL_HOME_SVC, `/${homeId}`);
  },

  getHomeByUsername: (
    username: string
  ): Promise<API.Response<HomeResponse>> => {
    return requests.put(URL_HOME_SVC, '', { username });
  },

  joinHome: (
    homeId: string,
    username: string
  ): Promise<API.Response<HomeResponse>> => {
    return requests.put(URL_HOME_SVC, `/${homeId}/join`, { username });
  },

  leaveHome: (username: string): Promise<API.Response<HomeResponse>> => {
    return requests.put(URL_HOME_SVC, `/leave`, { username });
  },

  deleteHome: (username: string): Promise<API.Response<HomeResponse>> => {
    return requests.delete(URL_HOME_SVC, `/`, { username });
  },
};

export default APIHome;
