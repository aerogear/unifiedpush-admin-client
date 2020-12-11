import {UpsAdminClient} from '../../../src';
import {createApplications, getAllApplications, initMockEngine} from '../mocks/UPSMock';
import {UPS_URL} from '../mocks/constants';

beforeEach(() => {
  initMockEngine();
});

describe('RenewVariantSecret', () => {
  const upsAdminClient = new UpsAdminClient(UPS_URL);

  it('Should renew a variant secret', async () => {
    createApplications({minVariantCount: 30});
    const testApp = getAllApplications()[5];

    const variantToRenew = testApp.variants![12];
    const oldSecret = variantToRenew.secret;

    const renewedVariant = await upsAdminClient.variants[variantToRenew.type]
      .renewSecret(testApp.pushApplicationID, variantToRenew.variantID)
      .execute();
    const newSecret = renewedVariant.secret;

    expect(renewedVariant.variantID).toEqual(variantToRenew.variantID);
    expect(newSecret).toBeDefined();
    expect(oldSecret).not.toEqual(renewedVariant.secret);
  });

  it('Should renew a android secret', async () => {
    createApplications({
      minVariantCount: 30,
      variantType: 'android',
      variantDef: {type: 'android', googleKey: 'googleKey', projectNumber: 'PRJNUMBER'},
    });
    const testApp = getAllApplications()[5];
    const variantToRenew = testApp.variants![12];
    const oldSecret = variantToRenew.secret;

    const renewedVariant = await upsAdminClient.variants.android
      .renewSecret(testApp.pushApplicationID, variantToRenew.variantID)
      .execute();
    const newSecret = renewedVariant.secret;

    expect(renewedVariant.variantID).toEqual(variantToRenew.variantID);
    expect(newSecret).toBeDefined();
    expect(oldSecret).not.toEqual(renewedVariant.secret);
  });

  it('Should renew a ios secret', async () => {
    createApplications({
      minVariantCount: 30,
      variantType: 'ios',
      variantDef: {type: 'ios', certificate: 'AAAAAAA', passphrase: 'SHhhhhhh!'},
    });
    const testApp = getAllApplications()[5];
    const variantToRenew = testApp.variants![12];
    const oldSecret = variantToRenew.secret;
    const renewedVariant = await upsAdminClient.variants.ios
      .renewSecret(testApp.pushApplicationID, variantToRenew.variantID)
      .execute();
    const newSecret = renewedVariant.secret;

    expect(renewedVariant.variantID).toEqual(variantToRenew.variantID);
    expect(newSecret).toBeDefined();
    expect(oldSecret).not.toEqual(renewedVariant.secret);
  });

  it('Should renew a ios token', async () => {
    createApplications({
      minVariantCount: 30,
      variantType: 'ios_token',
      variantDef: {type: 'ios_token', keyId: 'AAAAAAA', teamId: 'SHhhhhhh!'},
    });
    const testApp = getAllApplications()[5];
    const variantToRenew = testApp.variants![12];
    const oldSecret = variantToRenew.secret;
    const renewedVariant = await upsAdminClient.variants.ios_token
      .renewSecret(testApp.pushApplicationID, variantToRenew.variantID)
      .execute();
    const newSecret = renewedVariant.secret;

    expect(renewedVariant.variantID).toEqual(variantToRenew.variantID);
    expect(newSecret).toBeDefined();
    expect(oldSecret).not.toEqual(renewedVariant.secret);
  });

  it('Should renew a webpush token', async () => {
    createApplications({
      minVariantCount: 30,
      variantType: 'ios_token',
      variantDef: {
        type: 'web_push',
        publicKey: 'AAAAAAA',
        privateKey: 'SHhhhhhh!',
        alias: 'alias',
      },
    });
    const testApp = getAllApplications()[5];
    const variantToRenew = testApp.variants![12];
    const oldSecret = variantToRenew.secret;

    const renewedVariant = await upsAdminClient.variants.web_push
      .renewSecret(testApp.pushApplicationID, variantToRenew.variantID)
      .execute();
    const newSecret = renewedVariant.secret;

    expect(renewedVariant.variantID).toEqual(variantToRenew.variantID);
    expect(newSecret).toBeDefined();
    expect(oldSecret).not.toEqual(renewedVariant.secret);
  });
});
