import {SearchEngineFactory} from './search/SearchEngineFactory';
import {SearchResult} from './search/AbstractSearchCommand';
import {AbstractFilteredApplicationsCommand} from './AbstractFilteredApplicationsCommand';

export class SearchApplicationsCommand extends AbstractFilteredApplicationsCommand<
  SearchResult,
  SearchApplicationsCommand
> {
  private static readonly DEFAULT_PAGE_SIZE = 10;
  private pageSize: number = SearchApplicationsCommand.DEFAULT_PAGE_SIZE;

  readonly withPageSize = (pageSize: number): SearchApplicationsCommand => {
    this.pageSize = pageSize;
    return this;
  };

  readonly page = (pageNumber: number): SearchApplicationsCommand => {
    this.filter.page = pageNumber;
    return this;
  };

  protected readonly exec = async (): Promise<SearchResult> => {
    return SearchEngineFactory.produce(this.filter).execute(this.api, this.filter.page || 0, this.pageSize);
  };
}
