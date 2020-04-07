import { AxiosInstance } from 'axios';
import { applyPushApplicationFilter, PushApplication, PushApplicationFilter } from './PushApplication';

export class ApplicationsAdmin {
  async find(api: AxiosInstance, filter?: PushApplicationFilter): Promise<PushApplication[]> {
    let url = `/applications`;
    if (filter && filter.pushApplicationID) {
      url = `${url}/${filter.pushApplicationID}`;
      const res = (await api.get(url)).data;

      return res instanceof Array ? res : [res];
    } else {
      return applyPushApplicationFilter((await api.get(url)).data, filter);
    }
  }

  async create(api: AxiosInstance, name: string): Promise<PushApplication> {
    return (await api.post(`/applications`, { name })).data;
  }
}
