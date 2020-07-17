import {AbstractCommand} from '../AbstractCommand';
import {PushApplication} from './PushApplication';
import {ApiClient} from '../ApiClient';

export class RenewMasterSecretCommand extends AbstractCommand<PushApplication> {
  private readonly appId: string;

  constructor(api: ApiClient, appId: string) {
    super(api);
    this.appId = appId;
  }

  protected async exec(): Promise<PushApplication> {
    return (await this.api.put(`/applications/${this.appId}/reset`)).data as PushApplication;
  }
}
