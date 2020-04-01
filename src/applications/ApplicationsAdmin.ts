import { AxiosInstance } from 'axios';
import { applyPushApplicationFilter, PushApplication, PushApplicationFilter } from './PushApplication';

export class ApplicationsAdmin {
  async find(api: AxiosInstance, filter?: PushApplicationFilter): Promise<PushApplication[]> {
    let url = `/applications`;
    if (filter && filter.id) {
      url = `${url}/${filter.id}`;
      return (await api.get(url)).data;
    } else {
      let apps: PushApplication[] = (await api.get(url)).data;
      if (filter) {
        apps = applyPushApplicationFilter(apps, filter);
      }
      return apps;
    }
  }

  async create(api: AxiosInstance, name: string): Promise<PushApplication> {
    return (await api.post(`/applications`, { name })).data;
  }
}
