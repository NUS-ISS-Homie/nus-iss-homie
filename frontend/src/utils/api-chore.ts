import {
  NewChore,
  ChoreResponse,
  ChoresResponse,
  Chore,
} from '../@types/Chore';
import { URL_CHORE_SVC } from '../configs';
import { API, requests } from './api-request';

const APIChore = {
  createChore: (chore: NewChore): Promise<API.Response<ChoreResponse>> => {
    return requests.post(URL_CHORE_SVC, '', chore);
  },

  getChore: (choreId: string): Promise<API.Response<ChoreResponse>> => {
    return requests.get(URL_CHORE_SVC, `/${choreId}`);
  },

  getChoresByHomeId: (
    homeId: string
  ): Promise<API.Response<ChoresResponse>> => {
    return requests.get(URL_CHORE_SVC, `/home/${homeId}`);
  },

  getChoresByNotificationId: (
    notifictionId: string
  ): Promise<API.Response<ChoresResponse>> => {
    return requests.get(URL_CHORE_SVC, `/notification/${notifictionId}`);
  },

  updateChore: (chore: Chore): Promise<API.Response<ChoreResponse>> => {
    return requests.put(URL_CHORE_SVC, `/${chore._id}`, chore);
  },

  deleteChore: (choreId: string): Promise<API.Response<ChoreResponse>> => {
    return requests.delete(URL_CHORE_SVC, `/${choreId}`, {});
  },
};

export default APIChore;
