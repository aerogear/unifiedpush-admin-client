import {Variant} from './Variant';
import {AbstractFilteredVariantsCommand} from './AbstractFilteredVariantsCommand';

export class SearchVariantsCommand extends AbstractFilteredVariantsCommand<Variant[], SearchVariantsCommand> {
  protected async exec(): Promise<Variant[]> {
    let variants: Variant[];
    const url = `/applications/${this.appId}${this.filter?.type ? '/' + this.filter.type : ''}`;
    const response = await this.api.get(url, {
      validateStatus: (status: number) => (status >= 200 && status < 300) || status === 404,
    });

    if (response.status === 404) {
      return [];
    }

    const res = response.data;
    if (this.filter?.type) {
      // ensure that returned object is an array
      variants = res.filter ? res : [res];
    } else {
      // get all variants
      const _variants = res.variants || [];
      // ensure that returned object is an array
      variants = _variants.filter ? _variants : [_variants];
    }

    return this.applyVariantFilter(variants);
  }
}
