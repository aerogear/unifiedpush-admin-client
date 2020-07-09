import {AbstractSearchCommand, SearchResult} from './AbstractSearchCommand';
import {PushApplication, PushApplicationFilter} from '../PushApplication';
import {ApiClient} from '../../ApiClient';

export class SearchByID extends AbstractSearchCommand {
  readonly filter: PushApplicationFilter;
  constructor(filter: PushApplicationFilter) {
    super();
    this.filter = filter;
  }

  readonly execute = async (api: ApiClient): Promise<SearchResult> => {
    const url = `/applications/${this.filter.pushApplicationID}`;
    const response = await api.get(url, {
      params: {
        includeDeviceCount: true,
        includeActivity: true,
      },
      validateStatus: (status: number) => (status >= 200 && status < 300) || status === 404,
    });

    if (response.status === 404) {
      return {
        list: [],
        total: 0,
      };
    }

    const apps = this.applyPushApplicationFilter(
      this.ensureIsArray(response.data),
      this.filter
    ).map((app: PushApplication) => this.addActivityData(app, response));
    return {
      list: apps,
      total: apps.length,
    };
  };
}
