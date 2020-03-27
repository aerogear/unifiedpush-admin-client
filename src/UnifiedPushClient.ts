import axios, { AxiosInstance } from 'axios';
import { PushApplication, PushApplicationFilter } from './applications';
import { Variant, VariantFilter } from './variants';
import { VariantsAdmin } from './variants/VariantsAdmin';
import { ApplicationsAdmin } from './applications/ApplicationsAdmin';

const DEFAULT_REALM = 'aerogear';
const DEFAULT_CLIENT_ID = 'unified-push-server-js';

interface Credentials {
  username: string;
  password: string;
  type: 'basic';
}

/**
 * Interface for keycloak credentials
 */
interface KeyloakCredentials {
  kcUrl: string; // Keycloak URL
  username?: string;
  password?: string;
  realm?: string;
  client_id?: string;
  token?: string;
  type: 'keycloak';
}

export class UnifiedPushClient {
  private readonly apiURL: string;
  private api: AxiosInstance;
  private readonly credentials?: Credentials | KeyloakCredentials;

  private readonly applicationsAdmin = new ApplicationsAdmin();
  private readonly variantsAdmin = new VariantsAdmin();

  constructor(serverURL: string, credentials?: Credentials | KeyloakCredentials) {
    this.apiURL = `${serverURL}/rest`;
    this.api = axios.create({ baseURL: this.apiURL });
    this.credentials = credentials;
  }

  /**
   * Performs the authentication if needed
   */
  private readonly auth = async (): Promise<AxiosInstance> => {
    if (this.credentials?.type === 'keycloak') {
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

    // TODO: implement basic authentication

    return this.api;
  };

  readonly applications = {
    /**
     * Finds application
     * @param filter a filter to be used to find applications. If not specified, all applications are returned.
     */
    find: async (filter?: PushApplicationFilter): Promise<PushApplication[]> =>
      this.applicationsAdmin.find(await this.auth(), filter),
    /**
     * Creates an application in the UPS
     * @param app the application to be created
     */
    create: async (app: PushApplication): Promise<PushApplication> =>
      this.applicationsAdmin.create(await this.auth(), app),
  };

  readonly variants = {
    /**
     * Finds variants inside an application
     * @param appId The application id
     * @param filter filter to be used to filter the variants. If not specified, all variants are returned.
     */
    find: async (appId: string, filter?: VariantFilter): Promise<Variant[]> =>
      this.variantsAdmin.find(await this.auth(), appId, filter),
    /**
     * Creates a variant into the specified application
     * @param appId the id of the application
     * @param variant the variant to be created
     */
    create: async (appId: string, variant: Variant): Promise<Variant> =>
      this.variantsAdmin.create(await this.auth(), appId, variant),
  };
}
