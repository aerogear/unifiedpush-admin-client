import {AndroidVariant, UpsAdminClient} from '../../../../src';
import {createApplications, getAllApplications, initMockEngine} from '../../mocks/UPSMock';
import {UPS_URL} from '../../mocks/constants';

beforeEach(() => {
  initMockEngine(UPS_URL);
});

describe('CreateAndroidVariant', () => {
  const BASE_URL = 'http://localhost:8888';

  const upsAdminClient = new UpsAdminClient(BASE_URL);

  it('Should create an android variant', async () => {
    const TEST_NEW_VARIANT_TO_CREATE = {
      name: 'TestAndroid',
      googleKey: '123GOOGLE456',
      projectNumber: '123PRJ456',
      type: 'android',
    } as AndroidVariant;

    createApplications({appCount: 10});
    const appId = getAllApplications()[7].pushApplicationID;
    const variant = await upsAdminClient.variants.android
      .create(appId)
      .withName('TestAndroid')
      .withGoogleKey('123GOOGLE456')
      .withProjectNumber('123PRJ456')
      .execute();
    expect(variant).toMatchObject(TEST_NEW_VARIANT_TO_CREATE);
  });
});
