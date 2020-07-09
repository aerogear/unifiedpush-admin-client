import {Variant, VariantDefinition} from './Variant';

export interface WebPushVariant extends Variant {
  publicKey: string;
  privateKey: string;
  alias: string;
  type: 'web_push';
}

export interface WebPushVariantDefinition extends VariantDefinition {
  publicKey?: string;
  privateKey?: string;
  alias?: string;
  type?: 'web_push';
}
