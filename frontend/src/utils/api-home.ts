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
    userId: string
  ): Promise<API.Response<HomeModel>> => {
    return requests.put(URL_HOME_SVC, `/${homeId}/join`, { userId });
  },

  leaveHome: (
    homeId: string,
    userId: string
  ): Promise<API.Response<HomeModel>> => {
    return requests.put(URL_HOME_SVC, `/${homeId}/leave`, { userId });
  },

  deleteHome: (homeId: string): Promise<API.Response<HomeModel>> => {
    return requests.delete(URL_HOME_SVC, `/${homeId}`, '');
  },
};

export default APIHome;
