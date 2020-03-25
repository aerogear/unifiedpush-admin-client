import { applyPushApplicationFilter, PushApplication, PushApplicationFilter } from './PushApplication';
import axios from 'axios';
import { VARIANT_TYPE, Variant, VariantFilter, applyVariantFilter } from './Variant';
import { SUPPORTED_VARIANTS } from './const';

const SERVER_URL = 'http://localhost:9999';
const API_URL = `${SERVER_URL}/rest`;

export class UnifiedPushClient {
  readonly applications = {
    find: async (filter?: PushApplicationFilter): Promise<PushApplication[]> => {
      let url = `${API_URL}/applications`;
      if (filter && filter.id) {
        url = `${url}/${filter.id}`;
        return (await axios.get(url)).data;
      } else {
        let apps: PushApplication[] = (await axios.get(url)).data;
        if (filter) {
          apps = applyPushApplicationFilter(apps, filter);
        }
        return apps;
      }
    },
    create: async (app: PushApplication): Promise<PushApplication> => {
      return (await axios.post(`${API_URL}/applications`, app)).data;
    },
  };

  readonly variants = {
    find: async (appId: string, filter?: VariantFilter): Promise<Variant[]> => {
      let variants: Variant[];
      let url = `${API_URL}/applications/${appId}`;
      if (filter?.type) {
        url = `${url}/${filter.type}`;
        console.log('URL: ', url);
        variants = (await axios.get(url)).data;
      } else {
        // get all variants
        const variantsPromises: Array<Promise<Variant[]>> = SUPPORTED_VARIANTS.map(k => this.variants.find(appId, { type: k as VARIANT_TYPE }));
        const allVariants: Variant[][] = await Promise.all(variantsPromises);
        variants = allVariants.reduce((result: Variant[], current: Variant[]) => result.concat(current), []);
      }

      return applyVariantFilter(variants, filter);
    },
    create: async (appId: string, variant: Variant): Promise<Variant> => {
      return (await axios.post(`${API_URL}/applications/${appId}/${variant.type}`, variant)).data as Variant;
    }
  };
}
