import { Variant } from './Variant';

export interface WebPushVariant extends Variant {
  publicKey: string;
  privateKey: string;
  alias: string;
  type: 'web_push';
}
