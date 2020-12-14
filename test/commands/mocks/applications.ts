// applications mocks
import * as nock from 'nock';
import {DataStore} from './DataStore';
import {VariantsMock} from './variants';
import {PushApplication, PushApplicationDefinition, Variant} from '../../../src';
import {VariantDefinition} from '../../../src/commands/variants/Variant';
import {Guid} from 'guid-typescript';
import {getAppMetrics} from './UPSMock';
import {URL} from 'url';

interface VariantMockDictionary {
  [appId: string]: VariantsMock;
}

export class ApplicationsMock {
  private readonly datastore: DataStore;
  private readonly variantsMocks: VariantMockDictionary = {};
  private readonly basePath;
  constructor(datastore: DataStore, basePath: string) {
    this.datastore = datastore;
    this.basePath = basePath;
    this.setUpCreateMock();
    this.setUpGetApplicationsMock();
  }

  public readonly createApplication = (
    datastore: DataStore,
    appName: string,
    appDef: PushApplicationDefinition = {}
  ): PushApplication => {
    const app = this.datastore.createApp(appName, appDef, true);
    this.setUpGetApplicationMock(app.pushApplicationID);
    this.setUpDeleteMock(app.pushApplicationID);
    this.setUpUpdateMock(app.pushApplicationID);
    this.setUpRenewMasterSecretMock(app.pushApplicationID);
    this.setUpGetMetricsMock(app.pushApplicationID);
    this.variantsMocks[app.pushApplicationID] = new VariantsMock(this.basePath, this.datastore, app);
    return app;
  };

  public readonly createVariant = (
    appId: string,
    name: string,
    variantType: string,
    def: VariantDefinition = {}
  ): Variant => {
    const mock = this.variantsMocks[appId];
    return mock.createVariant(name, variantType, def);
  };

  private readonly setUpRenewMasterSecretMock = (appId: string) => {
    nock(`${this.basePath}`)
      .put(`/rest/applications/${appId}/reset`)
      .reply(() => {
        const app = this.datastore.getApp(appId);
        if (app) {
          app.masterSecret = Guid.create().toString();
          return [204, app];
        }
        return [404];
      })
      .persist();
  };

  private readonly setUpGetMetricsMock = (appId: string) => {
    nock(`${this.basePath}`)
      //.get(`/rest/metrics/messages/application/${appId}?page=0&per_page=10&sort=desc&search=`)
      .get(`/rest/metrics/messages/application/${appId}`)
      .query(() => true)
      .reply(uri => {
        const url = new URL(this.basePath + uri);
        const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : 0;
        const perPage = url.searchParams.get('per_page') ? parseInt(url.searchParams.get('per_page')!) : 10;
        const sort = url.searchParams.get('sort') ?? 'desc';
        const search = url.searchParams.get('search') ?? '';
        const metrics = getAppMetrics(appId, page, perPage, sort, search);
        if (!metrics) {
          return [404];
        }

        return [200, metrics, {total: getAppMetrics(appId).length}];
      })
      .persist();
  };

  private readonly setUpGetApplicationsMock = () => {
    nock(`${this.basePath}`)
      .get('/rest/applications')
      .query(() => true)
      .reply(uri => {
        const url = new URL(this.basePath + uri);
        const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page')!) : 0;
        const perPage = url.searchParams.get('per_page') ? parseInt(url.searchParams.get('per_page')!) : 10;
        return [
          200,
          getApplications(this.datastore, undefined, page, perPage),
          {total: this.datastore.getAllApps().length},
        ];
      })
      .persist();
  };

  private readonly setUpGetApplicationMock = (id: string) => {
    nock(this.basePath)
      .get(`/rest/applications/${id}`)
      .reply(() => {
        const app = this.datastore.getAllApps().find(app => app.pushApplicationID === id);
        if (app) {
          return [
            200,
            this.datastore.getAllApps().find(app => app.pushApplicationID === id),
            {total: this.datastore.getAllApps().length},
          ];
        }
        return [404];
      })
      .persist();
    nock(this.basePath)
      .get(`/rest/applications/${id}?includeDeviceCount=true&includeActivity=true`)
      .reply(() => {
        const app = this.datastore.getAllApps().find(app => app.pushApplicationID === id);
        if (app) {
          return [
            200,
            this.datastore.getAllApps().find(app => app.pushApplicationID === id),
            {total: this.datastore.getAllApps().length},
          ];
        }
        return [404];
      })
      .persist();
  };

  private readonly setUpCreateMock = (): void => {
    nock(this.basePath)
      .post('/rest/applications')
      .reply(200, (uri: string, body: PushApplicationDefinition) => {
        const app = this.datastore.createApp(body.name!);
        this.datastore.getAllApps().push(app);
        return app;
      });
  };

  private readonly setUpDeleteMock = (appId: string): void => {
    nock(this.basePath)
      .delete(`/rest/applications/${appId}`)
      .reply(() => {
        if (this.datastore.getAllApps().find(app => app.pushApplicationID === appId)) {
          // delete the app
          this.datastore.setAppList(this.datastore.getAllApps().filter(app => app.pushApplicationID !== appId));
          return [204];
        } else {
          return [404];
        }
      });
  };

  private readonly setUpUpdateMock = (appId: string): void => {
    nock(this.basePath)
      .put(`/rest/applications/${appId}`)
      .reply((url: string, body) => {
        const update = body as PushApplicationDefinition;
        const app = this.datastore.getAllApps().find(app => app.pushApplicationID === appId);
        if (app) {
          // update the app
          app.name = update.name ?? app.name;
          app.developer = update.developer ?? app.developer;
          app.description = update.description ?? app.description;
          return [204];
        } else {
          return [404];
        }
      });
  };
}

const getApplications = (
  datastore: DataStore,
  id?: string,
  page = 0,
  itemPerPage = 10
): PushApplication | PushApplication[] => {
  let apps: PushApplication[] | PushApplication | undefined;
  if (!id) {
    const firstIndex = itemPerPage * page;
    const endIndex = firstIndex + itemPerPage;

    apps = datastore.getAllApps().slice(firstIndex, endIndex);
  } else {
    apps = datastore.getAllApps().find(item => item.pushApplicationID === id);
  }
  return apps || [];
};
