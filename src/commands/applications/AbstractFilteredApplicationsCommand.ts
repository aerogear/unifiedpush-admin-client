import {AbstractCommand} from '../AbstractCommand';
import {PushApplicationFilter} from './PushApplication';

export abstract class AbstractFilteredApplicationsCommand<
  T,
  K extends AbstractFilteredApplicationsCommand<T, K>
> extends AbstractCommand<T> {
  protected filter: PushApplicationFilter = {};

  readonly withApplicationID = (appId: string): K => {
    this.filter.pushApplicationID = appId;
    return this as unknown as K;
  };

  readonly withName = (name: string): K => {
    this.filter.name = name;
    return this as unknown as K;
  };

  readonly withDeveloper = (developer: string): K => {
    this.filter.developer = developer;
    return this as unknown as K;
  };

  readonly withFilter = (filter: PushApplicationFilter): K => {
    this.filter = {
      ...this.filter,
      ...filter,
    };
    return this as unknown as K;
  };
}
