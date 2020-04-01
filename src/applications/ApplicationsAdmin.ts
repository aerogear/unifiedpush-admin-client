import { AxiosInstance } from 'axios';
import { applyPushApplicationFilter, PushApplication, PushApplicationFilter } from './PushApplication';

export class ApplicationsAdmin {
  async find(api: AxiosInstance, filter?: PushApplicationFilter): Promise<PushApplication[]> {
    let url = `/applications`;
    if (filter && filter.id) {
      url = `${url}/${filter.id}`;
      const res = (await api.get(url)).data;
      if (res instanceof Array) {
        return res;
      }

      return [res];
    } else {
      return applyPushApplicationFilter((await api.get(url)).data, filter);
    }
  }

  async create(api: AxiosInstance, name: string): Promise<PushApplication> {
    return (await api.post(`/applications`, { name })).data;
  }
}
