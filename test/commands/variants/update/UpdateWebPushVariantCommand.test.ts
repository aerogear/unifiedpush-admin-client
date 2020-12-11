import {UpsAdminClient, WebPushVariant} from '../../../../src';
import {createApplications, getAllApplications, initMockEngine} from '../../mocks/UPSMock';
import {UPS_URL} from '../../mocks/constants';

beforeEach(() => {
  initMockEngine();
});

describe('UpdateVariantCommand', () => {
  const upsAdminClient = new UpsAdminClient(UPS_URL);

  it('Should update webpush variant', async () => {
    createApplications({
      variantCount: 30,
      variantType: 'ios_token',
      variantDef: {type: 'web_push', privateKey: 'AAA', publicKey: 'BBB', alias: 'wrong'},
    });

    const testApp = getAllApplications()[5];
    const variantToUpdate = testApp.variants![12];
    const newAlias = 'mailto:test@aerogear.org';
    const newPublicKey = 'NEW PUB KEY';
    const newPrivateKey = 'NEW PRIV KEY';

    await upsAdminClient.variants.web_push
      .update(testApp.pushApplicationID, variantToUpdate.variantID)
      .withAlias(newAlias)
      .withPublicKey(newPublicKey)
      .withPrivateKey(newPrivateKey)
      .execute();

    const updatedVariant = (
      await upsAdminClient.variants.search(testApp.pushApplicationID).withVariantID(variantToUpdate.variantID).execute()
    )[0] as WebPushVariant;

    expect(updatedVariant.alias).toEqual(newAlias);
    expect(updatedVariant.publicKey).toEqual(newPublicKey);
    expect(updatedVariant.privateKey).toEqual(newPrivateKey);
  });
});
