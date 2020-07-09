import {SearchByID} from './SearchByID';
import {SearchAll} from './SearchAll';
import {SearchByFilter} from './SearchByFilter';
import {PushApplicationFilter} from '../PushApplication';

export class SearchEngineFactory {
  static produce = (filter?: PushApplicationFilter) => {
    if (filter?.pushApplicationID) {
      return new SearchByID(filter);
    }

    if (!filter || Object.keys(filter).length === 0 || (Object.keys(filter).length === 1 && filter.page)) {
      // no filters
      return new SearchAll();
    }
    return new SearchByFilter(filter!);
  };
}
