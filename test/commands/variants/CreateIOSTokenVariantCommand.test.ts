import {UpsAdminClient} from '../../../src';
import {UPSMock, utils} from '../../mocks';

const upsMock = new UPSMock();

beforeEach(() => {
  upsMock.reset();
});

afterAll(() => {
  upsMock.uninstall();
});

describe('CreateIOSTokenCommand', () => {
  const BASE_URL = 'http://localhost:8888';

  const upsAdminClient = new UpsAdminClient(BASE_URL);

  it('Should create an ios token variant', async () => {
    const IDs = utils.generateIDs(10);
    utils.generateApps(
      upsMock,
      10,
      IDs.map(id => ({pushApplicationID: id}))
    );
    const appId = IDs[7];

    const variant = await upsAdminClient.variants.ios_token
      .create(appId)
      .withName('TestIOSToken')
      .withTeamID('12345')
      .withPrivateKey('123456')
      .withKeyID('key')
      .withBundleID('org.aerogear')
      .isDevelopment()
      .execute();
    expect(variant.name).toBe('TestIOSToken');
    expect(variant.production).toBe(false);
  });
});
