import {
  SearchApplicationsCommand,
  CreateApplicationCommand,
  UpdateApplicationsCommand,
  DeleteApplicationsCommand,
} from './commands/applications';
import {SearchVariantsCommand} from './commands/variants/SearchVariantsCommand';
import {CreateAndroidVariantCommand} from './commands/variants/create/CreateAndroidVariantCommand';
import {DeleteVariantCommand} from './commands/variants/DeleteVariantCommand';
import {RenewSecretCommand} from './commands/variants/RenewSecretCommand';
import {UpdateAndroidVariantCommand} from './commands/variants/update/UpdateAndroidVariantCommand';
import {CreateIOSCertVariantCommand} from './commands/variants/create/CreateIOSCertVariantCommand';
import {CreateIOSTokenVariantCommand} from './commands/variants/create/CreateIOSTokenVariantCommand';
import {CreateWebPushVariantCommand} from './commands/variants/create/CreateWebPushVariantCommand';
import {UpdateIOSCertVariantCommand} from './commands/variants/update/UpdateIOSCertVariantCommand';
import {UpdateIOSTokenVariantCommand} from './commands/variants/update/UpdateIOSTokenVariantCommand';
import {UpdateWebPushVariantCommand} from './commands/variants/update/UpdateWebPushVariantCommand';
import {ApiClient} from './commands/ApiClient';
import {BasicCredentials, KeycloakCredentials} from './credentials';
import {RenewMasterSecretCommand} from './commands/applications/RenewMasterSecretCommand';
import {LoadMetricsCommand} from './commands/metrics/LoadMetricsCommand';

/**
 * This class is to be used to access the UPS admin function from typescript.
 * The functions are divided into two main branches:
 * * applications: contains all the functions that relate to applications
 * * variants: contains all the function that relates to variants
 *
 * The variant branch is itself divided into other branches, one for each of the supported platforms
 * (android, iOS, iOS_Token, webpush).
 */
export class UpsAdminClient {
  private readonly apiURL: string;
  private readonly api: ApiClient;
  private readonly credentials?: BasicCredentials | KeycloakCredentials;

  constructor(serverURL: string, credentials?: BasicCredentials | KeycloakCredentials) {
    this.apiURL = `${serverURL}/rest`;
    this.api = new ApiClient(this.apiURL, credentials);
    this.credentials = credentials;
  }

  /** Contains all the method related to application */
  readonly applications = {
    /**
     * Search for applications that match a specified filter.
     * To configure the filter, the fluent interface must be used:
     * ```typescript
     * const upsClient = new UpsAdminClient('http://myups:9999');
     * const searchResult = await upsClient.applications.search()
     *  .withName('myAppName')
     *  .execute();
     * ```
     * If no filter is specified, all applications are returned.
     *
     * **WARNING**: the result is paginated. use `.withPageSize` and `.page` to get the other pages.
     */
    search: () => new SearchApplicationsCommand(this.api),
    /**
     * Creates a new application. The only required parameter is the `application name`, however
     * other application details can be set through the usage of the fluid interface.
     * Example:
     * ```typescript
     * const upsClient = new UpsAdminClient('http://myups:9999');
     * const app = await upsClient.applications.create('mynewapp')
     *  .withDescription('Test application')
     *  .execute();
     * ```
     * @param name
     */
    create: (name: string) => new CreateApplicationCommand(this.api, name),
    /**
     * Updates application details. All the updatable fields can be set using the provided
     * fluid interface.
     * Example:
     * ```typescript
     * const upsClient = new UpsAdminClient('http://myups:9999');
     * await upsClient.applications.update('my-app-id')
     *  .withName('new name')
     *  .execute();
     * ```
     * @param appId the `pushApplicationID` of the app to be updated
     */
    update: (appId: string) => new UpdateApplicationsCommand(this.api, appId),
    /**
     * Deletes a set of push application.
     * Which application will be deleted is decided by applying the specified filter.
     *
     * **Warning**: specifying no filter means that all the applications will be deleted.
     * Example:
     * ```typescript
     * const upsClient = new UpsAdminClient('http://myups:9999');
     * await upsClient.applications.delete('my-app-id')
     *  .withName('name-of-the-app-to-delete')
     *  .execute();
     * ```
     */
    delete: () => new DeleteApplicationsCommand(this.api),
    metrics: (appId: string): LoadMetricsCommand => new LoadMetricsCommand(this.api, appId),
    renewSecret: (appId: string) => new RenewMasterSecretCommand(this.api, appId),
  };

  readonly variants = {
    search: (appId: string) => new SearchVariantsCommand(this.api, appId),
    delete: (appId: string) => new DeleteVariantCommand(this.api, appId),
    android: {
      create: (appId: string) => new CreateAndroidVariantCommand(this.api, appId),
      update: (appId: string, variantId: string) => new UpdateAndroidVariantCommand(this.api, appId, variantId),
      renewSecret: (appId: string, variantId: string) => new RenewSecretCommand(this.api, appId, 'android', variantId),
      search: (appId: string) => new SearchVariantsCommand(this.api, appId).withType('android'),
      delete: (appId: string) => new DeleteVariantCommand(this.api, appId).withType('android'),
    },
    ios: {
      create: (appId: string) => new CreateIOSCertVariantCommand(this.api, appId),
      update: (appId: string, variantId: string) => new UpdateIOSCertVariantCommand(this.api, appId, variantId),
      renewSecret: (appId: string, variantId: string) => new RenewSecretCommand(this.api, appId, 'ios', variantId),
      search: (appId: string) => new SearchVariantsCommand(this.api, appId).withType('ios'),
      delete: (appId: string) => new DeleteVariantCommand(this.api, appId).withType('ios'),
    },
    ios_token: {
      create: (appId: string) => new CreateIOSTokenVariantCommand(this.api, appId),
      update: (appId: string, variantId: string) => new UpdateIOSTokenVariantCommand(this.api, appId, variantId),
      renewSecret: (appId: string, variantId: string) =>
        new RenewSecretCommand(this.api, appId, 'ios_token', variantId),
      search: (appId: string) => new SearchVariantsCommand(this.api, appId).withType('ios_token'),
      delete: (appId: string) => new DeleteVariantCommand(this.api, appId).withType('ios_token'),
    },
    web_push: {
      create: (appId: string) => new CreateWebPushVariantCommand(this.api, appId),
      update: (appId: string, variantId: string) => new UpdateWebPushVariantCommand(this.api, appId, variantId),
      renewSecret: (appId: string, variantId: string) => new RenewSecretCommand(this.api, appId, 'web_push', variantId),
      search: (appId: string) => new SearchVariantsCommand(this.api, appId).withType('web_push'),
      delete: (appId: string) => new DeleteVariantCommand(this.api, appId).withType('web_push'),
    },
  };
}
