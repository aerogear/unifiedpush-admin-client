import {AbstractCommand} from '../AbstractCommand';
import {PushApplication, PushApplicationDefinition} from './PushApplication';
import {ApiClient} from '../ApiClient';

export class CreateApplicationCommand extends AbstractCommand<PushApplication> {
  private app: PushApplicationDefinition = {};

  constructor(api: ApiClient, appName: string) {
    super(api);
    this.app.name = appName;
  }

  readonly withDescription = (description: string): CreateApplicationCommand => {
    this.app.description = description;
    return this;
  };

  readonly withDeveloper = (developer: string): CreateApplicationCommand => {
    this.app.developer = developer;
    return this;
  };

  readonly withDefinition = (def: PushApplicationDefinition): CreateApplicationCommand => {
    this.app = {...this.app, ...def};
    return this;
  };

  protected async exec(): Promise<PushApplication> {
    return (await this.api.post('/applications', this.app)).data;
  }
}
