/* eslint-disable @typescript-eslint/interface-name-prefix */
import {Variant} from './Variant';

export interface IOSVariant extends Variant {
  certificate?: string;
  password?: string;
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
