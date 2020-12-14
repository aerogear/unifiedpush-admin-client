import {TEST_AUTH_CONFIG, TEST_UI_CONFIG, UPS_URL} from '../mocks/constants';
import {initMockEngine} from '../mocks/UPSMock';
import {UpsAdminClient} from '../../../src';

beforeEach(() => {
  initMockEngine();
});

describe('GetConfigCommand', () => {
  const upsAdminClient = new UpsAdminClient(UPS_URL);

  it('Should get the auth config from the UPS Server', async () => {
    const config = await upsAdminClient.config.auth.get().execute();
    expect(config).toMatchObject(TEST_AUTH_CONFIG);
  });

  it('Should get the ui config from the UPS Server', async () => {
    const config = await upsAdminClient.config.ui.get().execute();
    expect(config).toMatchObject(TEST_UI_CONFIG);
  });
});
