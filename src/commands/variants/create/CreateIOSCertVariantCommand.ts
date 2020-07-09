import {IOSVariant, IOSVariantDefinition} from '../IOSVariant';
import {AbstractCreateVariantCommand} from './AbstractCreateVariantCommand';
import {ApiClient} from '../../ApiClient';

export class CreateIOSCertVariantCommand extends AbstractCreateVariantCommand<
  IOSVariantDefinition,
  IOSVariant,
  CreateIOSCertVariantCommand
> {
  constructor(api: ApiClient, appId: string) {
    super(api, appId, 'ios');
  }
  readonly withCertificate = (certificate: string): CreateIOSCertVariantCommand => {
    this.def.certificate = certificate;
    return this;
  };

  readonly withPassphrase = (passphrase: string): CreateIOSCertVariantCommand => {
    this.def.passphrase = passphrase;
    return this;
  };

  readonly isProduction = (): CreateIOSCertVariantCommand => {
    this.def.production = true;
    return this;
  };

  readonly isDevelopment = (): CreateIOSCertVariantCommand => {
    this.def.production = false;
    return this;
  };
}
