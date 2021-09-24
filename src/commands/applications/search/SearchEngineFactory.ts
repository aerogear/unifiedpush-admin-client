import {SearchByID} from './SearchByID';
import {SearchAll} from './SearchAll';
import {SearchByFilter} from './SearchByFilter';
import {PushApplicationFilter} from '../PushApplication';
import {AbstractSearchCommand} from './AbstractSearchCommand';

export class SearchEngineFactory {
  static produce = (filter?: PushApplicationFilter): AbstractSearchCommand => {
    const noFilter = (): boolean => {
      if (!filter || Object.keys(filter).length === 0 || (Object.keys(filter).length === 1 && 'page' in filter)) {
        // no filters
        return true;
      }

      let res = true;
      Object.keys(filter).forEach(key => {
        if (key === 'page') {
          return;
        }
        if ((filter as unknown as Record<string, string>)[key]) {
          res = false;
        }
      });
      return res;
    };

    if (filter?.pushApplicationID) {
      return new SearchByID(filter);
    }

    if (noFilter()) {
      // no filters
      return new SearchAll();
    }
    return new SearchByFilter(filter!);
  };
}
