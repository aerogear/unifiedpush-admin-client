import {AndroidVariant, UnifiedPushAdminClient} from '../src';
import {KeycloakCredentials} from '../src/UnifiedPushAdminClient';
import {UPSMock} from './mocks';
import {utils} from './mocks';
import {KEYCLOAK_URL, KC_CREDENTIALS} from './mocks/rest/keycloak';

const BASE_URL = 'http://localhost:8888';

const upsMock = new UPSMock(true);

beforeEach(() => {
  upsMock.reset();
});

afterAll(() => {
  upsMock.uninstall();
});

describe('UnifiedPushAdminClient', () => {
  const credentials: KeycloakCredentials = {
    kcUrl: KEYCLOAK_URL,
    ...KC_CREDENTIALS,
    type: 'keycloak',
  };
  const NEW_APP_NAME = 'Test Application 1';

  it('Should return all apps', async () => {
    utils.generateApps(upsMock, 10);
    const apps = await new UnifiedPushAdminClient(BASE_URL, credentials).applications.find();
    expect(apps).toHaveLength(10);
  });

  it('Should create app', async () => {
    const app = await new UnifiedPushAdminClient(BASE_URL, credentials).applications.create(NEW_APP_NAME);
    expect(app.name).toEqual(NEW_APP_NAME);
  });

  it('Should find all variants', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    const appId = APP_IDS[5];
    const createdVariants = utils.generateVariants(upsMock, appId, 3);

    const variants = await new UnifiedPushAdminClient(BASE_URL, credentials).variants.find(appId);
    expect(variants).toEqual(createdVariants);
  });

  it('Should create an android variant', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    const appId = APP_IDS[5];

    const variant = await new UnifiedPushAdminClient(BASE_URL, credentials).variants.create(appId, {
      type: 'android',
      projectNumber: '12345',
      googleKey: '34645654',
      name: 'My beautiful variant',
    } as AndroidVariant);
    expect(variant).toMatchObject({
      type: 'android',
      projectNumber: '12345',
      googleKey: '34645654',
      name: 'My beautiful variant',
    });
  });
  it('Should delete a varianta', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    const appId = APP_IDS[5];
    const variants = utils.generateVariants(upsMock, appId, 30);

    const variantToDelete = variants[15];

    const variantsBefore = await new UnifiedPushAdminClient(BASE_URL, credentials).variants.find(appId, {
      variantID: variantToDelete.variantID,
    });
    expect(variantsBefore).toBeDefined();
    expect(variantsBefore).toHaveLength(1);
    await new UnifiedPushAdminClient(BASE_URL, credentials).variants.delete(appId, {
      variantID: variantToDelete.variantID,
    });
    const variantsAfter = await new UnifiedPushAdminClient(BASE_URL, credentials).variants.find(appId, {
      variantID: variantToDelete.variantID,
    });
    expect(variantsAfter).toBeDefined();
    expect(variantsAfter).toHaveLength(0);
  });
});
