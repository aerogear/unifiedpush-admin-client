import {AbstractCreateVariantCommand} from './AbstractCreateVariantCommand';
import {WebPushVariant, WebPushVariantDefinition} from '../WebPushVariant';
import {ApiClient} from '../../ApiClient';

export class CreateWebPushVariantCommand extends AbstractCreateVariantCommand<
  WebPushVariantDefinition,
  WebPushVariant,
  CreateWebPushVariantCommand
> {
  constructor(api: ApiClient, appId: string) {
    super(api, appId, 'web_push');
    this.def.type = 'web_push';
  }

  readonly withPublicKey = (publicKey: string): CreateWebPushVariantCommand => {
    this.def.publicKey = publicKey;
    return this;
  };

  readonly withPrivateKey = (privateKey: string): CreateWebPushVariantCommand => {
    this.def.privateKey = privateKey;
    return this;
  };

  readonly withAlias = (alias: string): CreateWebPushVariantCommand => {
    this.def.alias = alias;
    return this;
  };
}
