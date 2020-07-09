import {AbstractSearchCommand, SearchResult} from './AbstractSearchCommand';
import {PushApplication} from '../PushApplication';
import {ApiClient} from '../../ApiClient';

export class SearchAll extends AbstractSearchCommand {
  readonly execute = async (api: ApiClient, page: number, pageSize: number): Promise<SearchResult> => {
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
