import {UPS_URL} from '../../mocks/constants';
import {UpsAdminClient, WebPushVariant} from '../../../../src';
import {createApplications, getAllApplications, initMockEngine} from '../../mocks/UPSMock';

beforeEach(() => {
  initMockEngine(UPS_URL);
});

describe('RenewVapidKeysCommand', () => {
  const upsAdminClient = new UpsAdminClient(UPS_URL);

  it('Should renew the vapid keys', async () => {
    createApplications({variantCount: 10, variantType: 'web_push'});
    const testApp = getAllApplications()[2];
    const testVariant = testApp.variants![6] as WebPushVariant;

    const oldPublicKey = testVariant.publicKey;
    const oldPrivateKey = testVariant.privateKey;

    const updatedVariant = await upsAdminClient.variants.web_push
      .renewKeys(testApp.pushApplicationID, testVariant.variantID)
      .execute();

    expect(updatedVariant.privateKey).toBeDefined();
    expect(updatedVariant.privateKey.length).toBeGreaterThan(0);
    expect(updatedVariant.publicKey).toBeDefined();
    expect(updatedVariant.publicKey.length).toBeGreaterThan(0);
    expect(oldPublicKey).not.toEqual(updatedVariant.publicKey);
    expect(oldPrivateKey).not.toEqual(updatedVariant.privateKey);
  });
});
