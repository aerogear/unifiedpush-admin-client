import {SearchByID} from './SearchByID';
import {SearchAll} from './SearchAll';
import {SearchByFilter} from './SearchByFilter';
import {PushApplicationFilter} from '../PushApplication';
import {AbstractSearchCommand} from './AbstractSearchCommand';

export class SearchEngineFactory {
  static produce = (filter?: PushApplicationFilter): AbstractSearchCommand => {
    if (filter?.pushApplicationID) {
      return new SearchByID(filter);
    }

    if (!filter || Object.keys(filter).length === 0 || (Object.keys(filter).length === 1 && 'page' in filter)) {
      // no filters
      return new SearchAll();
    }
    return new SearchByFilter(filter!);
  };
}
