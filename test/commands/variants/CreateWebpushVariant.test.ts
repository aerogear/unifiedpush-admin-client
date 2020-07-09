import {UpsAdminClient, WebPushVariant} from '../../../src';
import {UPSMock, utils} from '../../mocks';

const upsMock = new UPSMock();

beforeEach(() => {
  upsMock.reset();
});

afterAll(() => {
  upsMock.uninstall();
});

describe('CreateWebpushVariant', () => {
  const BASE_URL = 'http://localhost:8888';

  const upsAdminClient = new UpsAdminClient(BASE_URL);

  it('Should create an android variant', async () => {
    const TEST_NEW_VARIANT_TO_CREATE = {
      name: 'WebPushVariant',
      privateKey: 'aaaa',
      publicKey: 'bbbb',
      alias: 'cccc',
      type: 'web_push',
    } as WebPushVariant;

    const IDs = utils.generateIDs(10);
    utils.generateApps(
      upsMock,
      10,
      IDs.map(id => ({pushApplicationID: id}))
    );
    const appId = IDs[7];
    const variant = await upsAdminClient.variants.web_push
      .create(appId)
      .withDefinition(TEST_NEW_VARIANT_TO_CREATE)
      .execute();

    expect(variant).toMatchObject(TEST_NEW_VARIANT_TO_CREATE);
  });
});
