import { Variant } from '../Variant';

export interface IOSVariant extends Variant {
  certificate?: string;
  password?: string;
  production: boolean;
}

export interface IOSTokenVariant extends IOSVariant {
  teamId: string;
  keyId: string;
  bundleId: string;
}
