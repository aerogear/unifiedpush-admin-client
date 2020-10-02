import {AbstractVariantCommand} from '../AbstractVariantCommand';
import {Variant} from '../Variant';
import {ApiClient} from '../../ApiClient';

export class RenewVapidKeysCommand extends AbstractVariantCommand<Variant> {
  private readonly variantId: string;

  constructor(api: ApiClient, appId: string, variantId: string) {
    super(api, appId);
    this.variantId = variantId;
  }

  protected async exec(): Promise<Variant> {
    return (await this.api.put(`/applications/${this.appId}/web_push/${this.variantId}/renew`)).data as Variant;
  }
}
