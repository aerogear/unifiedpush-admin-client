import {AbstractSearchCommand, SearchResult} from './AbstractSearchCommand';
import {PushApplicationFilter} from '../PushApplication';
import {ApiClient} from '../../ApiClient';

export class SearchByFilter extends AbstractSearchCommand {
  private readonly filter: PushApplicationFilter;

  constructor(filter: PushApplicationFilter) {
    super();
    this.filter = filter;
  }

  readonly execute = async (api: ApiClient, page: number, pageSize: number): Promise<SearchResult> => {
    const appList = this.applyPushApplicationFilter(await this.getAllApplications(api), this.filter);

    return {
      total: appList.length,
      list: this.getPage(appList, page, pageSize),
    };
  };
}
