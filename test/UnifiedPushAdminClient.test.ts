import * as nock from 'nock';
import {
  BASE_URL,
  KC_CREDENTIALS,
  KEYCLOAK_URL,
  mockKeyCloak,
  mockUps,
  NEW_APP,
  NEW_APP_NAME,
  TEST_NEW_VARIANT_CREATED,
  TEST_NEW_VARIANT_TO_CREATE,
} from './mocks/nockMocks';
import { UnifiedPushAdminClient } from '../src';
import { mockData } from './mocks/mockData';
import { KeycloakCredentials } from '../src/UnifiedPushAdminClient';

beforeAll(() => {
  mockUps(BASE_URL, true);
  mockKeyCloak();
});

afterAll(() => {
  nock.restore();
});

const TEST_APP_ID = '2:2';

describe('UnifiedPushAdminClient', () => {
  const credentials: KeycloakCredentials = {
    kcUrl: KEYCLOAK_URL,
    ...KC_CREDENTIALS,
    type: 'keycloak',
  };

  it('Should return all apps', async () => {
    const apps = await new UnifiedPushAdminClient(BASE_URL, credentials).applications.find();
    expect(apps).toEqual(mockData);
  });

  it('Should create app', async () => {
    const app = await new UnifiedPushAdminClient(BASE_URL, credentials).applications.create(NEW_APP_NAME);
    expect(app).toEqual(NEW_APP);
  });

  it('Should find all variants', async () => {
    const variants = await new UnifiedPushAdminClient(BASE_URL, credentials).variants.find(TEST_APP_ID);
    expect(variants).toEqual(mockData.find(app => app.pushApplicationID === TEST_APP_ID)!.variants);
  });

  it('Should create an android variant', async () => {
    const variant = await new UnifiedPushAdminClient(BASE_URL, credentials).variants.create(
      TEST_APP_ID,
      TEST_NEW_VARIANT_TO_CREATE
    );
    expect(variant).toEqual(TEST_NEW_VARIANT_CREATED);
  });
});
