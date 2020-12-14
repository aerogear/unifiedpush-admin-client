import {UpsAdminClient} from '../../../src';
import {UPS_URL} from '../mocks/constants';
import {createApplications, getAllApplications, initMockEngine} from '../mocks/UPSMock';

beforeEach(() => {
  initMockEngine(UPS_URL);
});

describe('RenewMasterSecretCommand', () => {
  const upsAdminClient = new UpsAdminClient(UPS_URL);

  it('Should renew the master secret', async () => {
    createApplications();
    const testApp = getAllApplications()[8];
    const oldSecret = testApp.masterSecret;
    await upsAdminClient.applications.renewSecret(testApp.pushApplicationID).execute();
    const newSecret = testApp.masterSecret;
    expect(oldSecret).not.toEqual(newSecret);
  });
});
