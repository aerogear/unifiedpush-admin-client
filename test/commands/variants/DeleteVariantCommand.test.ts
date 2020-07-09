import {UpsAdminClient} from '../../../src';
import {UPSMock, utils} from '../../mocks';
import {Variant} from '../../../src/commands/variants/Variant';

const upsMock = new UPSMock();

beforeEach(() => {
  upsMock.reset();
});

afterAll(() => {
  upsMock.uninstall();
});

describe('Delete Variant', () => {
  const BASE_URL = 'http://localhost:8888';

  const upsAdminClient = new UpsAdminClient(BASE_URL);

  it('Should delete a variant', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    // generate 10 variants for each app
    const variants: Record<string, Variant[]> = {};
    APP_IDS.forEach(id => (variants[id] = utils.generateVariants(upsMock, id, 10)));

    const appId = APP_IDS[3];
    const variantToDelete = variants[appId][4];

    // Ensure the variant exists now
    expect(await upsAdminClient.variants.search(appId).withVariantID(variantToDelete.variantID).execute()).toEqual([
      variantToDelete,
    ]);

    // Delete the variant
    await upsAdminClient.variants.delete(appId).withVariantID(variantToDelete.variantID).execute();

    // Ensure the variant does not exists anymore
    expect(await upsAdminClient.variants.search(appId).withVariantID(variantToDelete.variantID).execute()).toHaveLength(
      0
    );
  });

  it('Should delete a typed variant', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    const APP_ID = APP_IDS[5];
    const VARIANTS_ANDROID = utils.generateVariants(
      upsMock,
      APP_ID,
      30,
      Array<Record<string, string>>(30).fill({type: 'android', googleKey: 'OLDVALUE', projectNumber: 'PRJNUMBER'})
    );
    const VARIANTS_IOS = utils.generateVariants(
      upsMock,
      APP_ID,
      30,
      Array<Record<string, string>>(30).fill({type: 'ios', certificate: 'CSDSDDSD', passphrase: 'Shhhhhh!'})
    );
    const VARIANTS_IOSTOKEN = utils.generateVariants(
      upsMock,
      APP_ID,
      30,
      Array<Record<string, string>>(30).fill({
        type: 'ios_token',
        teamId: 'CSDSDDSD',
        keyId: 'KEYID',
        bundleId: 'org.aerogear',
        privateKey: 'AAAAA',
      })
    );
    const VARIANTS_WEBPUSH = utils.generateVariants(
      upsMock,
      APP_ID,
      30,
      Array<Record<string, string>>(30).fill({
        type: 'web_push',
        publicKey: 'CSDSDDSD',
        privateKey: 'Shhhhhh!',
        alias: 'mailto:aaa@bbb.cc',
      })
    );

    const androidVariantToDelete = VARIANTS_ANDROID[4];
    const iosVariantToDelete = VARIANTS_IOS[5];
    const iosTokenVariantToDelete = VARIANTS_IOSTOKEN[6];
    const webpushVariantToDelete = VARIANTS_WEBPUSH[7];

    // DELETING ANDROID VARIANT
    // Ensure the variant exists now
    expect(
      await upsAdminClient.variants.android.search(APP_ID).withVariantID(androidVariantToDelete.variantID).execute()
    ).toEqual([androidVariantToDelete]);
    // Delete the variant
    await upsAdminClient.variants.android.delete(APP_ID).withVariantID(androidVariantToDelete.variantID).execute();
    // Ensure the variant does not exists anymore
    expect(
      await upsAdminClient.variants.android.search(APP_ID).withVariantID(androidVariantToDelete.variantID).execute()
    ).toHaveLength(0);

    // DELETING IOS VARIANT
    // Ensure the variant exists now
    expect(
      await upsAdminClient.variants.ios.search(APP_ID).withVariantID(iosVariantToDelete.variantID).execute()
    ).toEqual([iosVariantToDelete]);
    // Delete the variant
    await upsAdminClient.variants.ios.delete(APP_ID).withVariantID(iosVariantToDelete.variantID).execute();
    // Ensure the variant does not exists anymore
    expect(
      await upsAdminClient.variants.ios.search(APP_ID).withVariantID(iosVariantToDelete.variantID).execute()
    ).toHaveLength(0);

    // DELETING IOS_TOKEN VARIANT
    // Ensure the variant exists now
    expect(
      await upsAdminClient.variants.ios_token.search(APP_ID).withVariantID(iosTokenVariantToDelete.variantID).execute()
    ).toEqual([iosTokenVariantToDelete]);
    // Delete the variant
    await upsAdminClient.variants.ios_token.delete(APP_ID).withVariantID(iosTokenVariantToDelete.variantID).execute();
    // Ensure the variant does not exists anymore
    expect(
      await upsAdminClient.variants.ios_token.search(APP_ID).withVariantID(iosTokenVariantToDelete.variantID).execute()
    ).toHaveLength(0);

    // DELETING WEBPUSH VARIANT
    // Ensure the variant exists now
    expect(
      await upsAdminClient.variants.web_push.search(APP_ID).withVariantID(webpushVariantToDelete.variantID).execute()
    ).toEqual([webpushVariantToDelete]);
    // Delete the variant
    await upsAdminClient.variants.web_push.delete(APP_ID).withVariantID(webpushVariantToDelete.variantID).execute();
    // Ensure the variant does not exists anymore
    expect(
      await upsAdminClient.variants.web_push.search(APP_ID).withVariantID(webpushVariantToDelete.variantID).execute()
    ).toHaveLength(0);
  });
});
