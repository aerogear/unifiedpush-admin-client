export type VariantType = 'android' | 'ios' | 'ios_token' | 'web_push';

export interface VariantDefinition {
  name?: string;
  developer?: string;
  secret?: string;
  description?: string;
  type?: VariantType;
  [key: string]: string | number | boolean | undefined | unknown;
}

export interface Variant extends VariantDefinition {
  id: string;
  variantID: string;
  name: string;
  description: string;
  developer: string;
  secret: string;
  type: VariantType;
  metadata?: {
    activity: number;
    deviceCount: number;
  };
}

export interface VariantFilter extends VariantDefinition {
  variantID?: string;
  name?: string;
  developer?: string;
  type?: VariantType;
}

export interface VariantUpdate extends VariantDefinition {
  name?: string;
  developer?: string;
  description?: string;
}
