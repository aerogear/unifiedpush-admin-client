import {AndroidVariant, UpsAdminClient} from '../../../src';
import {UPSMock, utils} from '../../mocks';

const upsMock = new UPSMock();

beforeEach(() => {
  upsMock.reset();
});

afterAll(() => {
  upsMock.uninstall();
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

    const IDs = utils.generateIDs(10);
    utils.generateApps(
      upsMock,
      10,
      IDs.map(id => ({pushApplicationID: id}))
    );
    const appId = IDs[7];
    const variant = await upsAdminClient.variants.android
      .create(appId)
      .withName('TestAndroid')
      .withGoogleKey('123GOOGLE456')
      .withProjectNumber('123PRJ456')
      .execute();
    expect(variant).toMatchObject(TEST_NEW_VARIANT_TO_CREATE);
  });
});
