import {UpsAdminClient} from '../../../../src';
import {createApplications, getAllApplications, initMockEngine} from '../../mocks/UPSMock';
import {UPS_URL} from '../../mocks/constants';

beforeEach(() => {
  initMockEngine(UPS_URL);
});

describe('CreateIOSCertVariant', () => {
  const BASE_URL = 'http://localhost:8888';

  const upsAdminClient = new UpsAdminClient(BASE_URL);

  it('Should create an ios cert variant', async () => {
    createApplications({});
    const appId = getAllApplications()[7].pushApplicationID;

    const nameProd = 'TESTIOS-PROD';
    const certProd = 'CERTIFICATE-PROD';
    const passphraseProd = 'PASSPHRASE-PROD';
    const nameDev = 'TESTIOS-DEV';
    const certDev = 'CERTIFICATE-DEV';
    const passphraseDev = 'PASSPHRASE-DEV';

    let variant = await upsAdminClient.variants.ios
      .create(appId)
      .withName(nameProd)
      .withCertificate(certProd)
      .withPassphrase(passphraseProd)
      .isProduction()
      .execute();
    expect(variant.name).toBe(nameProd);
    expect(variant.certificate).toBe(certProd);
    expect(variant.passphrase).toBe(passphraseProd);
    expect(variant.production).toBe(true);

    variant = await upsAdminClient.variants.ios
      .create(appId)
      .withName(nameDev)
      .withCertificate(certDev)
      .withPassphrase(passphraseDev)
      .isDevelopment()
      .execute();
    expect(variant.name).toBe(nameDev);
    expect(variant.certificate).toBe(certDev);
    expect(variant.passphrase).toBe(passphraseDev);
    expect(variant.production).toBe(false);
  });

  it('Should create using a definition', async () => {
    createApplications({});
    const appId = getAllApplications()[7].pushApplicationID;

    const nameProd = 'TESTIOS-PROD';
    const certProd = 'CERTIFICATE-PROD';
    const passphraseProd = 'PASSPHRASE-PROD';

    const variant = await upsAdminClient.variants.ios
      .create(appId)
      .withDefinition({name: nameProd, certificate: certProd, passphrase: passphraseProd, production: true})
      .execute();
    expect(variant.name).toBe(nameProd);
    expect(variant.certificate).toBe(certProd);
    expect(variant.passphrase).toBe(passphraseProd);
    expect(variant.production).toBe(true);
  });
});
