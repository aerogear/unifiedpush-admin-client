import {AbstractUpdateVariantCommand} from './AbstractUpdateVariantCommand';
import {WebPushVariantDefinition} from '../WebPushVariant';
import {ApiClient} from '../../ApiClient';

export class UpdateWebPushVariantCommand extends AbstractUpdateVariantCommand<
  UpdateWebPushVariantCommand,
  WebPushVariantDefinition
> {
  constructor(api: ApiClient, appId: string, variantId: string) {
    super(api, appId, variantId, 'web_push');
  }

  readonly withPublicKey = (publicKey: string): UpdateWebPushVariantCommand => {
    this.def.publicKey = publicKey;
    return this;
  };

  readonly withPrivateKey = (privateKey: string): UpdateWebPushVariantCommand => {
    this.def.privateKey = privateKey;
    return this;
  };

  readonly withAlias = (alias: string): UpdateWebPushVariantCommand => {
    this.def.alias = alias;
    return this;
  };
}
