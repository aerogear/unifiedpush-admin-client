import {IOSVariant, UpsAdminClient} from '../../../../src';
import {createApplications, getAllApplications, initMockEngine} from '../../mocks/UPSMock';
import {UPS_URL} from '../../mocks/constants';

beforeEach(() => {
  initMockEngine();
});

describe('UpdateIOSCertVariantCommand', () => {
  const upsAdminClient = new UpsAdminClient(UPS_URL);

  it('Should update ios variant', async () => {
    createApplications({variantCount: 30, variantType: 'ios'});

    const testApp = getAllApplications()[5];
    const variantToUpdate = testApp.variants![12];
    const newCertificateProd = 'NEW CERT PROD';
    const newPassphraseProd = 'NEW PASSPHRASE PROD';
    const newCertificateDev = 'NEW CERT DEV';
    const newPassphraseDev = 'NEW PASSPHRASE DEV';

    await upsAdminClient.variants.ios
      .update(testApp.pushApplicationID, variantToUpdate.variantID)
      .withCertificate(newCertificateProd)
      .withPassphrase(newPassphraseProd)
      .isProduction()
      .execute();

    let updatedVariant = (
      await upsAdminClient.variants.search(testApp.pushApplicationID).withVariantID(variantToUpdate.variantID).execute()
    )[0] as IOSVariant;

    expect(updatedVariant.certificate).toEqual(newCertificateProd);
    expect(updatedVariant.passphrase).toEqual(newPassphraseProd);
    expect(updatedVariant.production).toBe(true);

    await upsAdminClient.variants.ios
      .update(testApp.pushApplicationID, variantToUpdate.variantID)
      .withCertificate(newCertificateDev)
      .withPassphrase(newPassphraseDev)
      .isDevelopment()
      .execute();

    updatedVariant = (
      await upsAdminClient.variants.search(testApp.pushApplicationID).withVariantID(variantToUpdate.variantID).execute()
    )[0] as IOSVariant;

    expect(updatedVariant.certificate).toEqual(newCertificateDev);
    expect(updatedVariant.passphrase).toEqual(newPassphraseDev);
    expect(updatedVariant.production).toBe(false);
  });
});
