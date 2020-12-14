import {AbstractVariantCommand} from '../AbstractVariantCommand';
import {ApiClient} from '../../ApiClient';
import {WebPushVariant} from '../WebPushVariant';

export class RenewVapidKeysCommand extends AbstractVariantCommand<WebPushVariant> {
  private readonly variantId: string;

  constructor(api: ApiClient, appId: string, variantId: string) {
    super(api, appId);
    this.variantId = variantId;
  }

  protected async exec(): Promise<WebPushVariant> {
    return (await this.api.put(`/applications/${this.appId}/web_push/${this.variantId}/renew`)).data as WebPushVariant;
  }
}
