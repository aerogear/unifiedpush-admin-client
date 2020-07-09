import {AbstractUpdateVariantCommand} from './AbstractUpdateVariantCommand';
import {IOSTokenVariantDefinition} from '../IOSVariant';
import {ApiClient} from '../../ApiClient';

export class UpdateIOSTokenVariantCommand extends AbstractUpdateVariantCommand<
  UpdateIOSTokenVariantCommand,
  IOSTokenVariantDefinition
> {
  constructor(api: ApiClient, appId: string, variantId: string) {
    super(api, appId, variantId, 'ios_token');
  }

  readonly withTeamID = (teamId: string): UpdateIOSTokenVariantCommand => {
    this.def.teamId = teamId;
    return this;
  };

  readonly withKeyID = (keyId: string): UpdateIOSTokenVariantCommand => {
    this.def.keyId = keyId;
    return this;
  };

  readonly withBundleID = (bundleId: string): UpdateIOSTokenVariantCommand => {
    this.def.bundleId = bundleId;
    return this;
  };

  readonly withPrivateKey = (privateKey: string): UpdateIOSTokenVariantCommand => {
    this.def.privateKey = privateKey;
    return this;
  };

  readonly isProduction = (): UpdateIOSTokenVariantCommand => {
    this.def.production = true;
    return this;
  };

  readonly isDevelopment = (): UpdateIOSTokenVariantCommand => {
    this.def.production = false;
    return this;
  };
}
