import {AbstractCommand} from '../AbstractCommand';
import {PushApplicationDefinition} from './PushApplication';
import {ApiClient} from '../ApiClient';

export class UpdateApplicationsCommand extends AbstractCommand<void> {
  private updates: PushApplicationDefinition = {};
  private readonly appId: string;

  constructor(api: ApiClient, appId: string) {
    super(api);
    this.appId = appId;
  }

  readonly withName = (name: string): UpdateApplicationsCommand => {
    this.updates.name = name;
    return this;
  };

  readonly withDescription = (description: string): UpdateApplicationsCommand => {
    this.updates.description = description;
    return this;
  };

  readonly withDefinition = (def: PushApplicationDefinition): UpdateApplicationsCommand => {
    this.updates = {...this.updates, ...def};
    return this;
  };

  protected async exec(): Promise<void> {
    await this.api.put(`/applications/${this.appId}`, this.updates);
  }
}
