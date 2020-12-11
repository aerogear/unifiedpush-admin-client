import {UpsAdminClient} from '../../../src';
import {createApplications, createVariants, getAllApplications, initMockEngine} from '../mocks/UPSMock';
import {UPS_URL} from '../mocks/constants';

beforeEach(() => {
  initMockEngine(UPS_URL);
});

describe('Delete Variant', () => {
  const BASE_URL = 'http://localhost:8888';

  const upsAdminClient = new UpsAdminClient(BASE_URL);

  it('Should delete a variant', async () => {
    createApplications({variantCount: 10});

    const testApp = getAllApplications()[3];
    const appId = testApp.pushApplicationID;
    const variantToDelete = testApp.variants![4];

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
    createApplications({variantCount: 0});
    //const APP_IDS = utils.generateApps(upsMock, 10);
    const testApp = getAllApplications()[5];
    const testAppId = testApp.pushApplicationID;
    //const APP_ID = APP_IDS[5];

    const androidVariants = createVariants({
      appId: testAppId,
      variantCount: 30,
      variantType: 'android',
      variantDef: {type: 'android', googleKey: 'OLDVALUE', projectNumber: 'PRJNUMBER'},
    });

    const iosVariants = createVariants({
      appId: testAppId,
      variantCount: 30,
      variantType: 'ios',
      variantDef: {type: 'ios', certificate: 'CSDSDDSD', passphrase: 'Shhhhhh!'},
    });

    const iosTokenVariant = createVariants({
      appId: testAppId,
      variantCount: 30,
      variantType: 'ios_token',
      variantDef: {
        type: 'ios_token',
        teamId: 'CSDSDDSD',
        keyId: 'KEYID',
        bundleId: 'org.aerogear',
        privateKey: 'AAAAA',
      },
    });

    const webPushVariant = createVariants({
      appId: testAppId,
      variantCount: 30,
      variantType: 'web_push',
      variantDef: {
        type: 'web_push',
        publicKey: 'CSDSDDSD',
        privateKey: 'Shhhhhh!',
        alias: 'mailto:aaa@bbb.cc',
      },
    });
    // const VARIANTS_ANDROID = utils.generateVariants(
    //   upsMock,
    //   APP_ID,
    //   30,
    //   Array<Record<string, string>>(30).fill({type: 'android', googleKey: 'OLDVALUE', projectNumber: 'PRJNUMBER'})
    // );
    // const VARIANTS_IOS = utils.generateVariants(
    //   upsMock,
    //   APP_ID,
    //   30,
    //   Array<Record<string, string>>(30).fill({type: 'ios', certificate: 'CSDSDDSD', passphrase: 'Shhhhhh!'})
    // );
    // const VARIANTS_IOSTOKEN = utils.generateVariants(
    //   upsMock,
    //   APP_ID,
    //   30,
    //   Array<Record<string, string>>(30).fill({
    //     type: 'ios_token',
    //     teamId: 'CSDSDDSD',
    //     keyId: 'KEYID',
    //     bundleId: 'org.aerogear',
    //     privateKey: 'AAAAA',
    //   })
    // );
    // const VARIANTS_WEBPUSH = utils.generateVariants(
    //   upsMock,
    //   APP_ID,
    //   30,
    //   Array<Record<string, string>>(30).fill({
    //     type: 'web_push',
    //     publicKey: 'CSDSDDSD',
    //     privateKey: 'Shhhhhh!',
    //     alias: 'mailto:aaa@bbb.cc',
    //   })
    // );

    const androidVariantToDelete = androidVariants[4];
    const iosVariantToDelete = iosVariants[5];
    const iosTokenVariantToDelete = iosTokenVariant[6];
    const webpushVariantToDelete = webPushVariant[7];

    // DELETING ANDROID VARIANT
    // Ensure the variant exists now
    expect(
      await upsAdminClient.variants.android.search(testAppId).withVariantID(androidVariantToDelete.variantID).execute()
    ).toEqual([androidVariantToDelete]);
    // Delete the variant
    await upsAdminClient.variants.android.delete(testAppId).withVariantID(androidVariantToDelete.variantID).execute();
    // Ensure the variant does not exists anymore
    expect(
      await upsAdminClient.variants.android.search(testAppId).withVariantID(androidVariantToDelete.variantID).execute()
    ).toHaveLength(0);

    // DELETING IOS VARIANT
    // Ensure the variant exists now
    expect(
      await upsAdminClient.variants.ios.search(testAppId).withVariantID(iosVariantToDelete.variantID).execute()
    ).toEqual([iosVariantToDelete]);
    // Delete the variant
    await upsAdminClient.variants.ios.delete(testAppId).withVariantID(iosVariantToDelete.variantID).execute();
    // Ensure the variant does not exists anymore
    expect(
      await upsAdminClient.variants.ios.search(testAppId).withVariantID(iosVariantToDelete.variantID).execute()
    ).toHaveLength(0);

    // DELETING IOS_TOKEN VARIANT
    // Ensure the variant exists now
    expect(
      await upsAdminClient.variants.ios_token
        .search(testAppId)
        .withVariantID(iosTokenVariantToDelete.variantID)
        .execute()
    ).toEqual([iosTokenVariantToDelete]);
    // Delete the variant
    await upsAdminClient.variants.ios_token
      .delete(testAppId)
      .withVariantID(iosTokenVariantToDelete.variantID)
      .execute();
    // Ensure the variant does not exists anymore
    expect(
      await upsAdminClient.variants.ios_token
        .search(testAppId)
        .withVariantID(iosTokenVariantToDelete.variantID)
        .execute()
    ).toHaveLength(0);

    // DELETING WEBPUSH VARIANT
    // Ensure the variant exists now
    expect(
      await upsAdminClient.variants.web_push.search(testAppId).withVariantID(webpushVariantToDelete.variantID).execute()
    ).toEqual([webpushVariantToDelete]);
    // Delete the variant
    await upsAdminClient.variants.web_push.delete(testAppId).withVariantID(webpushVariantToDelete.variantID).execute();
    // Ensure the variant does not exists anymore
    expect(
      await upsAdminClient.variants.web_push.search(testAppId).withVariantID(webpushVariantToDelete.variantID).execute()
    ).toHaveLength(0);
  });
});
