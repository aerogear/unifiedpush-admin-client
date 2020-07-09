import {UpsAdminClient} from '../../../src';
import {UPSMock, utils} from '../../mocks';

const upsMock = new UPSMock();

beforeEach(() => {
  upsMock.reset();
});

afterAll(() => {
  upsMock.uninstall();
});

describe('RenewVariantSecret', () => {
  const BASE_URL = 'http://localhost:8888';

  const upsAdminClient = new UpsAdminClient(BASE_URL);

  it('Should renew a variant secret', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    const APP_ID = APP_IDS[5];
    const VARIANTS = utils.generateVariants(upsMock, APP_ID, 30);

    const variantToRenew = VARIANTS[12];
    const oldSecret = variantToRenew.secret;

    const renewedVariant = await upsAdminClient.variants[variantToRenew.type]
      .renewSecret(APP_ID, variantToRenew.variantID)
      .execute();
    const newSecret = renewedVariant.secret;

    expect(renewedVariant.variantID).toEqual(variantToRenew.variantID);
    expect(newSecret).toBeDefined();
    expect(oldSecret).not.toEqual(renewedVariant.secret);
  });

  it('Should renew a android secret', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    const APP_ID = APP_IDS[5];
    const VARIANTS = utils.generateVariants(
      upsMock,
      APP_ID,
      30,
      Array<Record<string, string>>(30).fill({type: 'android', googleKey: 'googleKey', projectNumber: 'PRJNUMBER'})
    );

    const variantToRenew = VARIANTS[12];
    const oldSecret = variantToRenew.secret;

    const renewedVariant = await upsAdminClient.variants.android
      .renewSecret(APP_ID, variantToRenew.variantID)
      .execute();
    const newSecret = renewedVariant.secret;

    expect(renewedVariant.variantID).toEqual(variantToRenew.variantID);
    expect(newSecret).toBeDefined();
    expect(oldSecret).not.toEqual(renewedVariant.secret);
  });

  it('Should renew a ios secret', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    const APP_ID = APP_IDS[5];
    const VARIANTS = utils.generateVariants(
      upsMock,
      APP_ID,
      30,
      Array<Record<string, string>>(30).fill({type: 'ios', certificate: 'AAAAAAA', passphrase: 'SHhhhhhh!'})
    );

    const variantToRenew = VARIANTS[12];
    const oldSecret = variantToRenew.secret;

    const renewedVariant = await upsAdminClient.variants.ios.renewSecret(APP_ID, variantToRenew.variantID).execute();
    const newSecret = renewedVariant.secret;

    expect(renewedVariant.variantID).toEqual(variantToRenew.variantID);
    expect(newSecret).toBeDefined();
    expect(oldSecret).not.toEqual(renewedVariant.secret);
  });

  it('Should renew a ios token', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    const APP_ID = APP_IDS[5];
    const VARIANTS = utils.generateVariants(
      upsMock,
      APP_ID,
      30,
      Array<Record<string, string>>(30).fill({type: 'ios_token', keyId: 'AAAAAAA', teamId: 'SHhhhhhh!'})
    );

    const variantToRenew = VARIANTS[12];
    const oldSecret = variantToRenew.secret;

    const renewedVariant = await upsAdminClient.variants.ios_token
      .renewSecret(APP_ID, variantToRenew.variantID)
      .execute();
    const newSecret = renewedVariant.secret;

    expect(renewedVariant.variantID).toEqual(variantToRenew.variantID);
    expect(newSecret).toBeDefined();
    expect(oldSecret).not.toEqual(renewedVariant.secret);
  });

  it('Should renew a webpush token', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    const APP_ID = APP_IDS[5];
    const VARIANTS = utils.generateVariants(
      upsMock,
      APP_ID,
      30,
      Array<Record<string, string>>(30).fill({
        type: 'web_push',
        publicKey: 'AAAAAAA',
        privateKey: 'SHhhhhhh!',
        alias: 'alias',
      })
    );

    const variantToRenew = VARIANTS[12];
    const oldSecret = variantToRenew.secret;

    const renewedVariant = await upsAdminClient.variants.web_push
      .renewSecret(APP_ID, variantToRenew.variantID)
      .execute();
    const newSecret = renewedVariant.secret;

    expect(renewedVariant.variantID).toEqual(variantToRenew.variantID);
    expect(newSecret).toBeDefined();
    expect(oldSecret).not.toEqual(renewedVariant.secret);
  });
});
