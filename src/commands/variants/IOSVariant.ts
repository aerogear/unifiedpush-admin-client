import {Variant, VariantDefinition} from './Variant';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IOSVariant extends Variant {
  certificate: string;
  passphrase: string;
  production: boolean;
  type: 'ios';
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IOSTokenVariant extends Variant {
  teamId: string;
  keyId: string;
  bundleId: string;
  production: boolean;
  privateKey: string; // private key in p8 format
  type: 'ios_token';
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IOSVariantDefinition extends VariantDefinition {
  certificate?: string;
  passphrase?: string;
  production?: boolean;
  type?: 'ios';
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IOSTokenVariantDefinition extends VariantDefinition {
  teamId?: string;
  keyId?: string;
  bundleId?: string;
  production?: boolean;
  privateKey?: string; // private key in p8 format
  type?: 'ios_token';
}
