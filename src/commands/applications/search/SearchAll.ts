import {AbstractSearchCommand, SearchResult} from './AbstractSearchCommand';
import {PushApplication} from '../PushApplication';
import {ApiClient} from '../../ApiClient';

export class SearchAll extends AbstractSearchCommand {
  readonly execute = async (api: ApiClient, page: number, pageSize: number): Promise<SearchResult> => {
    if (page === -1) {
      // all the pages should be returned
      const result: SearchResult = {total: 0, list: []};
      for (let i = 0; ; i++) {
        const res = await this.execute(api, i, 200);
        result.total = res.total > result.total ? res.total : result.total;
        if (res.list.length === 0) {
          break;
        }
        res.list.forEach(app => result.list.push(app));
      }
      return result;
    }
    const url = '/applications';
    const response = await api.get(url, {
      params: {
        includeDeviceCount: true,
        includeActivity: true,
        page: page,
        per_page: pageSize,
      },
      validateStatus: (status: number) => (status >= 200 && status < 300) || status === 404,
    });
    return {
      list: this.ensureIsArray(response.data).map((app: PushApplication) => this.addActivityData(app, response)),
      total: parseInt(response.headers['total']),
    };
  };
}
