import {Variant, VariantDefinition} from './Variant';

export interface IOSVariant extends Variant {
  certificate: string;
  passphrase: string;
  production: boolean;
  type: 'ios';
}

export interface IOSTokenVariant extends Variant {
  teamId: string;
  keyId: string;
  bundleId: string;
  production: boolean;
  privateKey: string; // private key in p8 format
  type: 'ios_token';
}

export interface IOSVariantDefinition extends VariantDefinition {
  certificate?: string;
  passphrase?: string;
  production?: boolean;
  type?: 'ios';
}

export interface IOSTokenVariantDefinition extends VariantDefinition {
  teamId?: string;
  keyId?: string;
  bundleId?: string;
  production?: boolean;
  privateKey?: string; // private key in p8 format
  type?: 'ios_token';
}
