import {AbstractCommand} from '../AbstractCommand';
import {ApiClient} from '../ApiClient';

type CONFIG_TYPE = 'ui' | 'auth';

export class GetConfigCommand extends AbstractCommand<Record<string, string>> {
  private readonly endpoint: string;

  constructor(api: ApiClient, confType: CONFIG_TYPE) {
    super(api);

    switch (confType) {
      case 'auth':
        this.endpoint = '/auth/config';
        break;
      case 'ui':
        this.endpoint = '/ui/config';
        break;
      default:
        this.endpoint = '';
    }
  }

  protected async exec(): Promise<Record<string, string>> {
    return (await this.api.get(this.endpoint, false)).data;
  }
}
