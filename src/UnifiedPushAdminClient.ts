import axios, {AxiosInstance} from 'axios';
import {PushApplication, PushApplicationSearchOptions} from './applications';
import {Variant, VARIANT_TYPE, VariantFilter} from './variants';
import {VariantsAdmin} from './variants/VariantsAdmin';
import {ApplicationsAdmin, SearchResults} from './applications/ApplicationsAdmin';
import {ErrorBuilder} from './errors/ErrorBuilder';
import {VariantUpdate} from './variants/Variant';

const DEFAULT_REALM = 'aerogear';
const DEFAULT_CLIENT_ID = 'unified-push-server-js';

export interface BasicCredentials {
  username: string;
  password: string;
  type: 'basic';
}

/**
 * Interface for keycloak credentials
 */
export interface KeycloakCredentials {
  kcUrl: string; // Keycloak URL
  username?: string;
  password?: string;
  realm?: string;
  client_id?: string;
  token?: string;
  type: 'keycloak';
}

export class UnifiedPushAdminClient {
  private readonly apiURL: string;
  private api: AxiosInstance;
  private readonly credentials?: BasicCredentials | KeycloakCredentials;

  private readonly applicationsAdmin = new ApplicationsAdmin();
  private readonly variantsAdmin = new VariantsAdmin();

  constructor(serverURL: string, credentials?: BasicCredentials | KeycloakCredentials) {
    this.apiURL = `${serverURL}/rest`;
    this.api = axios.create({baseURL: this.apiURL});
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
            `${this.credentials.kcUrl}/auth/realms/${
              this.credentials.realm || DEFAULT_REALM
            }/protocol/openid-connect/token`,
            `grant_type=password&client_id=${this.credentials.client_id || DEFAULT_CLIENT_ID}&username=${
              this.credentials.username
            }&password=${this.credentials.password}`
          )
        ).data.access_token;
      }
      this.api = axios.create({baseURL: this.apiURL, headers: {Authorization: `Bearer ${this.credentials.token}`}});
    }

    // TODO: implement basic authentication

    return this.api;
  };

  readonly applications = {
    /**
     * Finds application
     * @param filter a filter to be used to find applications. If not specified, all applications are returned.
     * @param page the number of the page to be visualised
     */
    find: async ({filter, page}: {filter?: PushApplicationSearchOptions; page?: number} = {}): Promise<SearchResults> =>
      this.applicationsAdmin.find(await this.auth(), {filter, page}),
    /**
     * Creates an application in the UPS
     * @param name the name of the application to be created
     */
    create: async (name: string): Promise<PushApplication> => this.applicationsAdmin.create(await this.auth(), name),

    /**
     * Rename an application
     * @param pushApplicationID id of the app to be renamed
     * @param newName
     */
    rename: async (pushApplicationID: string, newName: string) => {
      const app = (await this.applications.find({filter: {pushApplicationID}})).appList[0];
      app.name = newName;
      // Remove the variants
      app.variants = undefined;
      return this.applicationsAdmin.update(await this.auth(), app);
    },

    /**
     * delete an application
     * @param filter filter to be used to find the applications. If not specified, all applications are deleted.
     */
    delete: async (filter?: PushApplicationSearchOptions) => this.applicationsAdmin.delete(await this.auth(), filter),
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
    /**
     * Delete a variant by its Id
     * @param appId the id of the app this variant is associated with
     * @param filter filter to be used to filter the variants.
     */
    delete: async (appId: string, filter?: VariantFilter) =>
      this.variantsAdmin.delete(await this.auth(), appId, filter),

    update: async (appId: string, updates: VariantUpdate): Promise<void> =>
      (await manageError(async () => this.variantsAdmin.update(await this.auth(), appId, updates))) as Promise<void>,

    /**
     * Renew the secret of a given variant
     * @param appId The id of the application owning the variant
     * @param variantType The type of the variant
     * @param variantId The id of the variant
     */
    renewSecret: async (appId: string, variantType: VARIANT_TYPE, variantId: string): Promise<Variant> =>
      (await manageError(async () =>
        this.variantsAdmin.renewSecret(await this.auth(), appId, variantType, variantId)
      )) as Promise<Variant>,
  };
}

const manageError = async (func: () => unknown): Promise<unknown> => {
  try {
    return await func();
  } catch (error) {
    if (error.response) {
      throw ErrorBuilder.forResponse(error.response).build();
    }
    throw error;
  }
};
