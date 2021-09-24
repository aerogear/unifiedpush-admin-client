import {Variant, VariantFilter, VariantType} from './Variant';
import {AbstractVariantCommand} from './AbstractVariantCommand';

export abstract class AbstractFilteredVariantsCommand<
  T,
  K extends AbstractFilteredVariantsCommand<T, K>
> extends AbstractVariantCommand<T> {
  protected filter: VariantFilter = {};

  readonly withVariantID = (variantID: string): K => {
    this.filter.variantID = variantID;
    return this as unknown as K;
  };

  readonly withName = (name: string): K => {
    this.filter.name = name;
    return this as unknown as K;
  };

  readonly withType = (type: VariantType): K => {
    this.filter.type = type;
    return this as unknown as K;
  };

  readonly withFilter = (filter: VariantFilter): K => {
    this.filter = {
      ...this.filter,
      ...filter,
    };
    return this as unknown as K;
  };

  protected readonly applyVariantFilter = (variants: Variant[]): Variant[] => {
    if (this.filter) {
      return variants.filter(
        variant =>
          (!this.filter.name || this.filter.name === variant.name) &&
          (!this.filter.description || this.filter.description === variant.description) &&
          (!this.filter.variantID || this.filter.variantID === variant.variantID) &&
          (!this.filter.developer || this.filter.developer === variant.developer) &&
          (!this.filter.type || this.filter.type === variant.type)
      );
    }
    return variants;
  };
}
