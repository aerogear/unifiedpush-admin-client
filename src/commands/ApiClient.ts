import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {BasicCredentials, DEFAULT_CLIENT_ID, DEFAULT_REALM, KeycloakCredentials} from '../credentials';

export class ApiClient {
  private readonly api: AxiosInstance;
  private readonly credentials?: BasicCredentials | KeycloakCredentials;
  private readonly baseURL: string;

  constructor(baseURL: string, credentials?: BasicCredentials | KeycloakCredentials) {
    this.api = axios.create({baseURL: baseURL});
    this.credentials = credentials;
    this.baseURL = baseURL;
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
      return axios.create({
        baseURL: this.baseURL,
        headers: {Authorization: `Bearer ${this.credentials.token}`},
      });
    }

    // TODO: implement basic authentication

    return this.api;
  };

  async post(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return (await this.auth()).post(url, data, config);
  }

  async put(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return (await this.auth()).put(url, data, config);
  }

  async delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return (await this.auth()).delete(url, config);
  }

  async get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return (await this.auth()).get(url, config);
  }
}
