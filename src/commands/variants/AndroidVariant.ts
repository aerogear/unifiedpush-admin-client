import {Variant, VariantDefinition} from './Variant';

export interface AndroidVariant extends Variant {
  googleKey: string;
  projectNumber: string;
  type: 'android';
}

export interface AndroidVariantDefinition extends VariantDefinition {
  googleKey?: string;
  projectNumber?: string;
  type: 'android';
}
