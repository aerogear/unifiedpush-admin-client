import {IOSTokenVariant, UpsAdminClient} from '../../../../src';
import {createApplications, getAllApplications, initMockEngine} from '../../mocks/UPSMock';
import {UPS_URL} from '../../mocks/constants';

beforeEach(() => {
  initMockEngine();
});

describe('UpdateIOSTokenVariantCommand', () => {
  const upsAdminClient = new UpsAdminClient(UPS_URL);

  it('Should update io_token variant', async () => {
    createApplications({variantCount: 30, variantType: 'ios_token'});

    const testApp = getAllApplications()[5];
    const variantToUpdate = testApp.variants![12];
    const newKeyIDProd = 'NEW KEY ID Prod';
    const newTeamIDProd = 'NEW TEAM ID Prod';
    const newBundleIdProd = 'NEW BUNDLE ID Prod';
    const newPrivateKeyProd = 'NEW PRIVATE KEY Prod';
    const newKeyIDDev = 'NEW KEY ID Dev';
    const newTeamIDDev = 'NEW TEAM ID Dev';
    const newBundleIdDev = 'NEW BUNDLE ID Dev';
    const newPrivateKeyDev = 'NEW PRIVATE KEY Dev';

    await upsAdminClient.variants.ios_token
      .update(testApp.pushApplicationID, variantToUpdate.variantID)
      .withKeyID(newKeyIDProd)
      .withTeamID(newTeamIDProd)
      .withBundleID(newBundleIdProd)
      .withPrivateKey(newPrivateKeyProd)
      .isProduction()
      .execute();

    let updatedVariant = (
      await upsAdminClient.variants.search(testApp.pushApplicationID).withVariantID(variantToUpdate.variantID).execute()
    )[0] as IOSTokenVariant;

    expect(updatedVariant.keyId).toEqual(newKeyIDProd);
    expect(updatedVariant.teamId).toEqual(newTeamIDProd);
    expect(updatedVariant.bundleId).toEqual(newBundleIdProd);
    expect(updatedVariant.privateKey).toEqual(newPrivateKeyProd);
    expect(updatedVariant.production).toBe(true);

    await upsAdminClient.variants.ios_token
      .update(testApp.pushApplicationID, variantToUpdate.variantID)
      .withKeyID(newKeyIDDev)
      .withTeamID(newTeamIDDev)
      .withBundleID(newBundleIdDev)
      .withPrivateKey(newPrivateKeyDev)
      .isDevelopment()
      .execute();

    updatedVariant = (
      await upsAdminClient.variants.search(testApp.pushApplicationID).withVariantID(variantToUpdate.variantID).execute()
    )[0] as IOSTokenVariant;

    expect(updatedVariant.keyId).toEqual(newKeyIDDev);
    expect(updatedVariant.teamId).toEqual(newTeamIDDev);
    expect(updatedVariant.bundleId).toEqual(newBundleIdDev);
    expect(updatedVariant.privateKey).toEqual(newPrivateKeyDev);
    expect(updatedVariant.production).toBe(false);
  });
});
