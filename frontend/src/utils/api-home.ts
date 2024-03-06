import { HomeModel } from '../@types/HomeContext';
import { URL_HOME_SVC } from '../configs';
import { API, requests } from './api-request';

const APIHome = {
  createHome: (adminUser: string): Promise<API.Response<HomeModel>> => {
    return requests.post(URL_HOME_SVC, '', { adminUser });
  },

  getHome: (homeId: string): Promise<API.Response<HomeModel>> => {
    return requests.get(URL_HOME_SVC, `/${homeId}`);
  },

  joinHome: (
    homeId: string,
    username: string
  ): Promise<API.Response<HomeModel>> => {
    return requests.put(URL_HOME_SVC, `/${homeId}/join`, { username });
  },

  leaveHome: (
    homeId: string,
    username: string
  ): Promise<API.Response<HomeModel>> => {
    return requests.put(URL_HOME_SVC, `/${homeId}/leave`, { username });
  },

  deleteHome: (homeId: string): Promise<API.Response<HomeModel>> => {
    return requests.delete(URL_HOME_SVC, `/${homeId}`, '');
  },
};

export default APIHome;
