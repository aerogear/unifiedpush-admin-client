export type VARIANT_TYPE = 'android' | 'ios' | 'ios_token' | 'web_push';

export interface VariantUpdate {
  variantID: string;
  type: VARIANT_TYPE;
  [key: string]: string;
}

export interface VariantFilter {
  id?: string;
  name?: string;
  description?: string;
  variantID?: string;
  developer?: string;
  type?: VARIANT_TYPE;
}

export interface Variant extends VariantFilter {
  name: string;
  developer: string;
  secret?: string;
  type: VARIANT_TYPE;

  deviceCount?: number;
  activity?: number;
}

export const applyVariantFilter = (variants: Variant[], filter?: VariantFilter): Variant[] => {
  if (filter) {
    return variants.filter(
      variant =>
        (!filter.name || filter.name === variant.name) &&
        (!filter.description || filter.description === variant.description) &&
        (!filter.variantID || filter.variantID === variant.variantID) &&
        (!filter.developer || filter.developer === variant.developer) &&
        (!filter.type || filter.type === variant.type)
    );
  }
  return variants;
};
