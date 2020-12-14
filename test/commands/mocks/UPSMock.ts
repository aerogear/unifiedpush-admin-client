import * as nock from 'nock';
import {DataStore} from './DataStore';
import {ApplicationsMock} from './applications';
import {UPS_URL, VARIANTS} from './constants';
import {PushApplication, PushApplicationDefinition, Variant} from '../../../src';
import {VariantDefinition} from '../../../src/commands/variants/Variant';
import {AuthMock} from './auth';
import {FlatPushMessageInformation} from '../../../src/commands/metrics/LoadMetricsCommand';

const datastore = new DataStore();
let applicationMocks: ApplicationsMock | undefined = undefined;

export const initMockEngine = (basePath = UPS_URL): void => {
  datastore.reset();
  nock.cleanAll();
  applicationMocks = new ApplicationsMock(datastore, basePath);
  new AuthMock(basePath);
};

// applications mocks
export const createApplication = (name: string, appDef: PushApplicationDefinition = {}): PushApplication =>
  applicationMocks!.createApplication(datastore, name, appDef);

export const getAllApplications = (): PushApplication[] => datastore.getAllApps();
export const getAppMetrics = (
  appId: string,
  page = -1,
  perPage = 10,
  sort = 'desc',
  search = ''
): FlatPushMessageInformation[] => datastore.getAppMetrics(appId, page, perPage, sort, search);
// variants mocks
export const createVariant = (appId: string, name: string, variantType: string, def: VariantDefinition = {}): Variant =>
  applicationMocks!.createVariant(appId, name, variantType, def);

export const deleteApplication = (id: string): void => datastore.deleteApplication(id);

interface SharedVariantsParams {
  variantCount?: number;
  variantNamePrefix?: string;
  variantType?: string;
  minVariantCount?: number;
  variantDef?: VariantDefinition;
}

interface CreateVariantsParams extends SharedVariantsParams {
  appId: string;
}

interface CreateAppParams extends SharedVariantsParams {
  appCount?: number;
  appDef?: PushApplicationDefinition;
  appNamePrefix?: string;
}

interface CreateMetricsParams {
  appId: string;
  count?: number;
  minCount?: number;
  maxCount?: number;
}

export const createApplications = ({
  appCount = 10,
  variantCount = -1,
  appNamePrefix = 'APP-',
  variantNamePrefix = 'VAR-',
  variantType = undefined,
  minVariantCount = 3,
  appDef = {},
  variantDef = {},
}: CreateAppParams = {}): void => {
  for (let i = 0; i < appCount; i++) {
    const app = createApplication(`${appNamePrefix}${i}`, appDef);
    createVariants({
      appId: app.pushApplicationID,
      variantCount,
      minVariantCount,
      variantNamePrefix,
      variantType,
      variantDef,
    });
  }
};

export const createMetrics = ({appId, count = -1, minCount = 3, maxCount = 50}: CreateMetricsParams): void => {
  const metricsCount = count === -1 ? Math.ceil(Math.random() * maxCount) + minCount : count;

  for (let i = 0; i < metricsCount; i++) {
    datastore.generateMetrics(appId);
  }
};
export const createVariants = ({
  variantCount = 10,
  variantNamePrefix = 'VAR-',
  variantType = undefined,
  minVariantCount = 3,
  appId,
  variantDef = {},
}: CreateVariantsParams): Variant[] => {
  const res = [];
  const randomVariantType = () => {
    return VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
  };

  for (let i = 0; i < (variantCount !== -1 ? variantCount : Math.floor(Math.random() * 20 + minVariantCount)); i++) {
    res.push(createVariant(appId, `${variantNamePrefix}${i}`, variantType ?? randomVariantType(), variantDef));
  }

  return res;
};
