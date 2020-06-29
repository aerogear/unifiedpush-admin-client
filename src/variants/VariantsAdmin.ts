import {AxiosInstance} from 'axios';
import {applyVariantFilter, Variant, VARIANT_TYPE, VariantFilter, VariantUpdate} from './Variant';
import * as FormData from 'form-data';
import {IOSVariant} from './IOSVariant';
import {NotFoundError} from '../errors/NotFoundError';

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

  private async createIOSVariant(api: AxiosInstance, appId: string, variant: IOSVariant): Promise<Variant> {
    const formData = new FormData();

    formData.append('name', variant.name);
    formData.append('production', `${variant.production}`);
    formData.append('passphrase', variant.password);
    formData.append('certificate', variant.certificate!);

    const requestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...formData.getHeaders(),
      },
    };
    return (await api.post(`/applications/${appId}/${variant.type}`, formData.getBuffer(), requestConfig)).data;
  }

  async create(api: AxiosInstance, appId: string, variant: Variant): Promise<Variant> {
    if (variant.type === 'ios') {
      return this.createIOSVariant(api, appId, variant as IOSVariant);
    }
    return (await api.post(`/applications/${appId}/${variant.type}`, variant)).data as Variant;
  }

  async delete(api: AxiosInstance, appId: string, filter?: VariantFilter) {
    return Promise.all(
      (await this.find(api, appId, filter)).map(variant =>
        api.delete(`/applications/${appId}/${variant.type}/${variant.variantID!}`).then(() => variant)
      )
    );
  }

  async update(api: AxiosInstance, appId: string, update: VariantUpdate) {
    const searchResult = await this.find(api, appId, {variantID: update.variantID});

    if (searchResult.length === 0) {
      throw new NotFoundError(
        `Unable to find a variant with id '${update.variantID}' in the app identified by '${appId}'`
      );
    }

    const variantToBeUpdated = {...searchResult[0], ...update};

    return api.put(`/applications/${appId}/${update.type}/${update.variantID}`, variantToBeUpdated);
  }

  async renewSecret(api: AxiosInstance, appId: string, variantType: VARIANT_TYPE, variantId: string): Promise<Variant> {
    return (await api.put(`/applications/${appId}/${variantType}/${variantId}/reset`)).data as Variant;
  }
}
