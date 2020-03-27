import { AxiosInstance } from 'axios';
import { applyVariantFilter, Variant, VariantFilter } from './Variant';

export class VariantsAdmin {
  async find(api: AxiosInstance, appId: string, filter?: VariantFilter): Promise<Variant[]> {
    let variants: Variant[];
    const url = `/applications/${appId}${filter?.type ? '/' + filter.type : ''}`;
    const res = (await api.get(url)).data;
    if (filter?.type) {
      // ensure that returned object is an array
      variants = res.filter ? res : [res];
    } else {
      // get all variants
      const _variants = res.variants || [];
      // ensure that returned object is an array
      variants = _variants.filter ? _variants : [_variants];
    }

    return applyVariantFilter(variants, filter);
  }

  async create(api: AxiosInstance, appId: string, variant: Variant): Promise<Variant> {
    return (await api.post(`/applications/${appId}/${variant.type}`, variant)).data as Variant;
  }
}
