import {AndroidVariant, IOSTokenVariant, IOSVariant, UpsAdminClient} from '../../../src';
import {UPSMock, utils} from '../../mocks';
import {VariantUpdate} from '../../../src/commands/variants/Variant';

const upsMock = new UPSMock();

beforeEach(() => {
  upsMock.reset();
});

afterAll(() => {
  upsMock.uninstall();
});

describe('UpdateVariantCommand', () => {
  const BASE_URL = 'http://localhost:8888';

  const upsAdminClient = new UpsAdminClient(BASE_URL);

  it('Should update a variant name', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    const APP_ID = APP_IDS[5];
    const VARIANTS = utils.generateVariants(upsMock, APP_ID, 30);

    const variantToUpdate = VARIANTS[12];
    const newName = 'new name';
    const update: VariantUpdate = {
      variantID: variantToUpdate.variantID!,
      type: variantToUpdate.type,
      name: newName,
    };

    await upsAdminClient.variants[variantToUpdate.type]
      .update(APP_ID, variantToUpdate.variantID)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .withVariantDefinition(update as any)
      .execute();

    const updatedVariant = (
      await upsAdminClient.variants.search(APP_ID).withVariantID(variantToUpdate.variantID).execute()
    )[0];

    expect(updatedVariant.name).toEqual(newName);
  });

  it('Should update googleKey', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    const APP_ID = APP_IDS[5];
    const VARIANTS = utils.generateVariants(
      upsMock,
      APP_ID,
      30,
      Array<Record<string, string>>(30).fill({type: 'android', googleKey: 'OLDVALUE', projectNumber: 'PRJNUMBER'})
    );

    const variantToUpdate = VARIANTS[12];
    const newGoogleKey = 'NEW GOOGLEKEYVALUE';

    await upsAdminClient.variants.android
      .update(APP_ID, variantToUpdate.variantID)
      .withGoogleKey(newGoogleKey)
      .execute();

    const updatedVariant = (
      await upsAdminClient.variants.search(APP_ID).withVariantID(variantToUpdate.variantID).execute()
    )[0] as AndroidVariant;

    expect(updatedVariant.googleKey).toEqual(newGoogleKey);
  });

  it('Should update ios certificate', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    const APP_ID = APP_IDS[5];
    const VARIANTS = utils.generateVariants(
      upsMock,
      APP_ID,
      30,
      Array<Record<string, string>>(30).fill({type: 'ios', certificate: 'OLDVALUE', passphrase: 'Shhhhhh!!!'})
    );

    const variantToUpdate = VARIANTS[12];
    const newCertificate = 'NEW CERt';

    await upsAdminClient.variants.ios
      .update(APP_ID, variantToUpdate.variantID)
      .withCertificate(newCertificate)
      .execute();

    const updatedVariant = (
      await upsAdminClient.variants.search(APP_ID).withVariantID(variantToUpdate.variantID).execute()
    )[0] as IOSVariant;

    expect(updatedVariant.certificate).toEqual(newCertificate);
  });

  it('Should update ios KeyID and teamID', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    const APP_ID = APP_IDS[5];
    const VARIANTS = utils.generateVariants(
      upsMock,
      APP_ID,
      30,
      Array<Record<string, string>>(30).fill({type: 'ios_token', keyId: 'OLDVALUE', teamId: 'OLDVALUE'})
    );

    const variantToUpdate = VARIANTS[12];
    const newKeyID = 'NEW KEY ID';
    const newTeamID = 'NEW TEAM ID';

    await upsAdminClient.variants.ios_token
      .update(APP_ID, variantToUpdate.variantID)
      .withKeyID(newKeyID)
      .withTeamID(newTeamID)
      .execute();

    const updatedVariant = (
      await upsAdminClient.variants.search(APP_ID).withVariantID(variantToUpdate.variantID).execute()
    )[0] as IOSTokenVariant;

    expect(updatedVariant.keyId).toEqual(newKeyID);
    expect(updatedVariant.teamId).toEqual(newTeamID);
  });

  it('Should update webpush alias', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    const APP_ID = APP_IDS[5];
    const VARIANTS = utils.generateVariants(
      upsMock,
      APP_ID,
      30,
      Array<Record<string, string>>(30).fill({type: 'web_push', privateKey: 'AAA', publicKey: 'BBB', alias: 'wrong'})
    );

    const variantToUpdate = VARIANTS[12];
    const newAlias = 'mailto:test@aerogear.org';

    await upsAdminClient.variants.web_push.update(APP_ID, variantToUpdate.variantID).withAlias(newAlias).execute();

    const updatedVariant = (
      await upsAdminClient.variants.search(APP_ID).withVariantID(variantToUpdate.variantID).execute()
    )[0] as IOSTokenVariant;

    expect(updatedVariant.alias).toEqual(newAlias);
  });
});
