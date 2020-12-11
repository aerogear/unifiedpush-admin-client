import {UpsAdminClient} from '../../../src';
import {createApplications, createVariants, getAllApplications, initMockEngine} from '../mocks/UPSMock';
import {UPS_URL} from '../mocks/constants';

beforeEach(() => {
  initMockEngine();
});

describe('SearchVariantCommand', () => {
  const upsAdminClient = new UpsAdminClient(UPS_URL);

  it('Should return all the variants of a given app', async () => {
    createApplications({variantCount: 0});
    const testAppNoVariants = getAllApplications()[5];
    const testApp2 = getAllApplications()[2];
    const testApp8 = getAllApplications()[8];

    const variants2 = createVariants({
      appId: testApp2.pushApplicationID,
      variantCount: 35,
      variantType: 'android',
      variantDef: {
        type: 'android',
        googleKey: '123456',
        projectNumber: '1234556',
      },
    });

    const variants8 = createVariants({
      appId: testApp8.pushApplicationID,
      variantCount: 35,
      variantType: 'ios',
      variantDef: {
        type: 'ios',
        production: false,
        certificate: '123',
      },
    });

    const foundVariants1 = await upsAdminClient.variants.search(testApp2.pushApplicationID).execute();
    expect(foundVariants1).toEqual(variants2);

    const foundVariants8 = await upsAdminClient.variants.search(testApp8.pushApplicationID).execute();
    expect(foundVariants8).toEqual(variants8);

    const appNoVariants = await upsAdminClient.variants.search(testAppNoVariants.pushApplicationID).execute();
    expect(appNoVariants).toHaveLength(0);
  });

  it('Should return a given variant', async () => {
    createApplications({variantCount: 30});
    const testApp = getAllApplications()[5];
    const variantToFind = testApp.variants![12];

    const filteredVariants = await upsAdminClient.variants
      .search(testApp.pushApplicationID)
      .withVariantID(variantToFind.variantID)
      .execute();
    expect(filteredVariants).toEqual([variantToFind]);
  });

  it('Should return empty result', async () => {
    createApplications({variantCount: 30});
    const testApp = getAllApplications()[5];

    const filteredVariants = await upsAdminClient.variants
      .search(testApp.pushApplicationID)
      .withName("Can't find me")
      .execute();
    expect(filteredVariants).toEqual([]);
  });

  it('Should return all variants of a given type', async () => {
    createApplications({variantCount: 10});

    const testApp1 = getAllApplications()[3];
    const testApp2 = getAllApplications()[8];

    const filteredAndroidVariants = await upsAdminClient.variants.android.search(testApp1.pushApplicationID).execute();

    const filterediOSVariants = await upsAdminClient.variants.ios.search(testApp2.pushApplicationID).execute();
    expect(filteredAndroidVariants).toEqual(testApp1.variants!.filter(variant => variant.type === 'android'));
    expect(filterediOSVariants).toEqual(testApp2.variants!.filter(variant => variant.type === 'ios'));
  });
});
