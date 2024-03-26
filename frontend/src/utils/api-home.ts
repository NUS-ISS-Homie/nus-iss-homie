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

  getHomeByUserId: (userId: string): Promise<API.Response<HomeResponse>> => {
    return requests.put(URL_HOME_SVC, '', { userId });
  },

  joinHome: (
    homeId: string,
    userId: string
  ): Promise<API.Response<HomeResponse>> => {
    return requests.put(URL_HOME_SVC, `/${homeId}/join`, { userId });
  },

  leaveHome: (userId: string): Promise<API.Response<HomeResponse>> => {
    return requests.put(URL_HOME_SVC, `/leave`, { userId });
  },

  deleteHome: (userId: string): Promise<API.Response<HomeResponse>> => {
    return requests.delete(URL_HOME_SVC, `/`, { userId });
  },
};

export default APIHome;
