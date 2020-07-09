import {AbstractUpdateVariantCommand} from './AbstractUpdateVariantCommand';
import {IOSVariantDefinition} from '../IOSVariant';
import {ApiClient} from '../../ApiClient';

export class UpdateIOSCertVariantCommand extends AbstractUpdateVariantCommand<
  UpdateIOSCertVariantCommand,
  IOSVariantDefinition
> {
  constructor(api: ApiClient, appId: string, variantId: string) {
    super(api, appId, variantId, 'ios');
  }

  readonly withCertificate = (certificate: string): UpdateIOSCertVariantCommand => {
    this.def.certificate = certificate;
    return this;
  };

  readonly withPassphrase = (passphrase: string): UpdateIOSCertVariantCommand => {
    this.def.passphrase = passphrase;
    return this;
  };

  readonly isProduction = (): UpdateIOSCertVariantCommand => {
    this.def.production = true;
    return this;
  };

  readonly isDevelopment = (): UpdateIOSCertVariantCommand => {
    this.def.production = false;
    return this;
  };
}
