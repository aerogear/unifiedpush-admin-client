import {AbstractCommand} from '../AbstractCommand';
import {ApiClient} from '../ApiClient';

export abstract class AbstractVariantCommand<T> extends AbstractCommand<T> {
  protected readonly appId: string;
  constructor(api: ApiClient, appId: string) {
    super(api);
    this.appId = appId;
  }
}
