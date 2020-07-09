import {UpsAdminClient} from '../../../src';
import {UPSMock, utils} from '../../mocks';

const upsMock = new UPSMock();

beforeEach(() => {
  upsMock.reset();
});

afterAll(() => {
  upsMock.uninstall();
});

describe('CreateIOSCertVariant', () => {
  const BASE_URL = 'http://localhost:8888';

  const upsAdminClient = new UpsAdminClient(BASE_URL);

  it('Should create an ios cert variant', async () => {
    const IDs = utils.generateIDs(10);
    utils.generateApps(
      upsMock,
      10,
      IDs.map(id => ({pushApplicationID: id}))
    );
    const appId = IDs[7];

    const variant = await upsAdminClient.variants.ios
      .create(appId)
      .withName('TestIOS')
      .withCertificate('THISSHOULDBEBASE64')
      .withPassphrase('thisshouldbethepassword')
      .isDevelopment()
      .execute();
    expect(variant.name).toBe('TestIOS');
    expect(variant.production).toBe(false);
  });
});
