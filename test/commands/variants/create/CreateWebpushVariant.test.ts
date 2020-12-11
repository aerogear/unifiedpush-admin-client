import {UpsAdminClient, WebPushVariant} from '../../../../src';
import {createApplications, getAllApplications, initMockEngine} from '../../mocks/UPSMock';
import {UPS_URL} from '../../mocks/constants';

beforeEach(() => {
  initMockEngine(UPS_URL);
});

describe('CreateWebpushVariant', () => {
  const BASE_URL = 'http://localhost:8888';

  const upsAdminClient = new UpsAdminClient(BASE_URL);

  it('Should create an web_push variant using a definition', async () => {
    const TEST_NEW_VARIANT_TO_CREATE = {
      name: 'WebPushVariant',
      privateKey: 'aaaa',
      publicKey: 'bbbb',
      alias: 'cccc',
      type: 'web_push',
    } as WebPushVariant;

    createApplications({});
    const appId = getAllApplications()[7].pushApplicationID;
    const variant = await upsAdminClient.variants.web_push
      .create(appId)
      .withDefinition(TEST_NEW_VARIANT_TO_CREATE)
      .execute();

    expect(variant).toMatchObject(TEST_NEW_VARIANT_TO_CREATE);
  });

  it('Should create an web_push variant using fluent api', async () => {
    const TEST_NEW_VARIANT_TO_CREATE = {
      name: 'WebPushVariant',
      privateKey: 'aaaa',
      publicKey: 'bbbb',
      alias: 'cccc',
      type: 'web_push',
      developer: 'TEST_DEVELOPER',
      description: 'TEST VARIANT',
      secret: 'Shhhhh!!!!',
    } as WebPushVariant;

    createApplications({});
    const appId = getAllApplications()[7].pushApplicationID;
    const variant = await upsAdminClient.variants.web_push
      .create(appId)
      .withName(TEST_NEW_VARIANT_TO_CREATE.name)
      .withPrivateKey(TEST_NEW_VARIANT_TO_CREATE.privateKey)
      .withPublicKey(TEST_NEW_VARIANT_TO_CREATE.publicKey)
      .withAlias(TEST_NEW_VARIANT_TO_CREATE.alias)
      .withDeveloper(TEST_NEW_VARIANT_TO_CREATE.developer)
      .withDescription(TEST_NEW_VARIANT_TO_CREATE.description)
      .withSecret(TEST_NEW_VARIANT_TO_CREATE.secret)
      .execute();

    expect(variant).toMatchObject(TEST_NEW_VARIANT_TO_CREATE);
  });
});
