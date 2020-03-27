import { applyPushApplicationFilter, PushApplication, PushApplicationFilter } from './PushApplication';
import axios, { AxiosInstance } from 'axios';
import { Variant, VariantFilter, applyVariantFilter } from './Variant';

const DEFAULT_REALM = 'aerogear';
const DEFAULT_CLIENT_ID = 'unified-push-server-js';

interface Credentials {
  kcUrl: string;
  username?: string;
  password?: string;
  realm?: string;
  client_id?: string;
  token?: string;
}

abstract class AbstractUnifiedPushClient {
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
                `${this.credentials.kcUrl}/auth/realms/${this.credentials.realm ||
                DEFAULT_REALM}/protocol/openid-connect/token`,
                `grant_type=password&client_id=${this.credentials.client_id || DEFAULT_CLIENT_ID}&username=${
                    this.credentials.username
                }&password=${this.credentials.password}`
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
      return this.findApplications(this.api, filter);
    },
    /**
     * Creates an application in the UPS
     * @param app the application to be created
     */
    create: async (app: PushApplication): Promise<PushApplication> => {
      await this.login();
      return this.createApplication(this.api, app);
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
      return this.findVariants(this.api, appId, filter);
    },
    /**
     * Creates a variant into the specified application
     * @param appId the id of the application
     * @param variant the variant to be created
     */
    create: async (appId: string, variant: Variant): Promise<Variant> => {
      await this.login();
      return this.createVariant(this.api, appId, variant);
    },
  };

  protected abstract async findApplications(api: AxiosInstance, filter?: PushApplicationFilter): Promise<PushApplication[]>;
  protected abstract async createApplication(api: AxiosInstance, app: PushApplication): Promise<PushApplication>;

  protected abstract async findVariants(api: AxiosInstance, appId: string, filter?: VariantFilter): Promise<Variant[]>;
  protected abstract async createVariant(api: AxiosInstance, appId: string, variant: Variant): Promise<Variant>;
}

export class UnifiedPushClient extends AbstractUnifiedPushClient {

  constructor(serverURL: string, credentials?: Credentials) {
    super(serverURL, credentials);
  }

  protected async findApplications(api: AxiosInstance, filter?: PushApplicationFilter): Promise<PushApplication[]> {
    let url = `/applications`;
    if (filter && filter.id) {
      url = `${url}/${filter.id}`;
      return (await api.get(url)).data;
    } else {
      let apps: PushApplication[] = (await api.get(url)).data;
      if (filter) {
        apps = applyPushApplicationFilter(apps, filter);
      }
      return apps;
    }
  }

  protected async createApplication(api: AxiosInstance, app: PushApplication): Promise<PushApplication> {
    return (await api.post(`/applications`, app)).data;
  }

  protected async findVariants(api: AxiosInstance, appId: string, filter?: VariantFilter): Promise<Variant[]> {
    let variants: Variant[];
    const url = `/applications/${appId}${filter?.type ? '/' + filter.type : ''}`;
    const res = (await api.get(url)).data;
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
  }

  protected async createVariant(api: AxiosInstance, appId: string, variant: Variant): Promise<Variant> {
    return (await api.post(`/applications/${appId}/${variant.type}`, variant)).data as Variant;
  }
}
