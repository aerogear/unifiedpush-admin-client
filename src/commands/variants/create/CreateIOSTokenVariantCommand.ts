import {IOSTokenVariant, IOSTokenVariantDefinition} from '../IOSVariant';
import {AbstractCreateVariantCommand} from './AbstractCreateVariantCommand';
import {ApiClient} from '../../ApiClient';

export class CreateIOSTokenVariantCommand extends AbstractCreateVariantCommand<
  IOSTokenVariantDefinition,
  IOSTokenVariant,
  CreateIOSTokenVariantCommand
> {
  constructor(api: ApiClient, appId: string) {
    super(api, appId, 'ios_token');
    this.def.type = 'ios_token';
  }
  readonly withTeamID = (teamId: string): CreateIOSTokenVariantCommand => {
    this.def.teamId = teamId;
    return this;
  };

  readonly withKeyID = (keyId: string): CreateIOSTokenVariantCommand => {
    this.def.keyId = keyId;
    return this;
  };

  readonly withBundleID = (bundleId: string): CreateIOSTokenVariantCommand => {
    this.def.bundleId = bundleId;
    return this;
  };

  readonly withPrivateKey = (privateKey: string): CreateIOSTokenVariantCommand => {
    this.def.privateKey = privateKey;
    return this;
  };

  readonly isProduction = (): CreateIOSTokenVariantCommand => {
    this.def.production = true;
    return this;
  };

  readonly isDevelopment = (): CreateIOSTokenVariantCommand => {
    this.def.production = false;
    return this;
  };
}
