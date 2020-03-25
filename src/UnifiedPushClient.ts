import { applyPushApplicationFilter, PushApplication, PushApplicationFilter } from './PushApplication';
import axios from 'axios';
import { VARIANT_TYPE, Variant, VariantFilter, applyVariantFilter } from './Variant';
import { SUPPORTED_VARIANTS } from './const';

export class UnifiedPushClient {
  readonly apiURL: string;

  constructor(serverURL: string) {
    this.apiURL = `${serverURL}/rest`;
  }

  readonly applications = {
    /**
     * Finds application
     * @param filter a filter to be used to find applications. If not specified, all applications are returned.
     */
    find: async (filter?: PushApplicationFilter): Promise<PushApplication[]> => {
      let url = `${this.apiURL}/applications`;
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
    /**
     * Creates an application in the UPS
     * @param app the application to be created
     */
    create: async (app: PushApplication): Promise<PushApplication> => {
      return (await axios.post(`${this.apiURL}/applications`, app)).data;
    },
  };

  readonly variants = {
    /**
     * Finds variants inside an application
     * @param appId The application id
     * @param filter filter to be used to filter the variants. If not specified, all variants are returned.
     */
    find: async (appId: string, filter?: VariantFilter): Promise<Variant[]> => {
      let variants: Variant[];
      let url = `${this.apiURL}/applications/${appId}`;
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

    /**
     * Creates a variant into the specified application
     * @param appId the id of the application
     * @param variant the variant to be created
     */
    create: async (appId: string, variant: Variant): Promise<Variant> => {
      return (await axios.post(`${this.apiURL}/applications/${appId}/${variant.type}`, variant)).data as Variant;
    },
  };
}
