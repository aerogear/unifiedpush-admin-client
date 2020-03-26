import { applyPushApplicationFilter, PushApplication, PushApplicationFilter } from './PushApplication';
import axios, { AxiosInstance } from 'axios';
import { Variant, VariantFilter, applyVariantFilter } from './Variant';

const REALM = 'aerogear';
const CLIENT_ID = 'unified-push-server-js';

interface Credentials {
  kcUrl: string;
  username?: string;
  password?: string;
  token?: string;
}

export class UnifiedPushClient {
  private readonly apiURL: string;
  private api: AxiosInstance;
  private readonly credentials?: Credentials;

  constructor(serverURL: string, credentials?: Credentials) {
    this.apiURL = `${serverURL}/rest`;
    this.api = axios.create({ baseURL: this.apiURL });
    this.credentials = credentials;
  }

  private readonly login = async () => {
    if (this.credentials) {
      if (!this.credentials.token) {
        this.credentials.token = (
          await axios.post(
            `${this.credentials.kcUrl}/auth/realms/${REALM}/protocol/openid-connect/token`,
            `grant_type=password&client_id=${CLIENT_ID}&username=${this.credentials.username}&password=${this.credentials.password}`
          )
        ).data.access_token;
      }
      this.api = axios.create({ baseURL: this.apiURL, headers: { Authorization: `Bearer ${this.credentials.token}` } });
    }
  };

  readonly applications = {
    /**
     * Finds application
     * @param filter a filter to be used to find applications. If not specified, all applications are returned.
     */
    find: async (filter?: PushApplicationFilter): Promise<PushApplication[]> => {
      await this.login();
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
      await this.login();
      let variants: Variant[];
      const url = `${this.apiURL}/applications/${appId}${filter?.type ? '/' + filter.type : ''}`;
      const res = (await this.api.get(url)).data;
      if (filter?.type) {
        // ensure that returned object is an array
        variants = res.filter ? res : [res];
      } else {
        // get all variants
        const _variants = res.variants;
        // ensure that returned object is an array
        variants = _variants.filter ? _variants : [_variants];
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
