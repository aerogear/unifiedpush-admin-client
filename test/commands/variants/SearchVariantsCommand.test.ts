import {AndroidVariant, IOSVariant, UpsAdminClient} from '../../../src';
import {UPSMock, utils} from '../../mocks';
import {Variant} from '../../../src/commands/variants/Variant';

const upsMock = new UPSMock();

beforeEach(() => {
  upsMock.reset();
});

afterAll(() => {
  upsMock.uninstall();
});

describe('SearchVariantCommand', () => {
  const BASE_URL = 'http://localhost:8888';

  const upsAdminClient = new UpsAdminClient(BASE_URL);

  it('Should return all the variants of a given app', async () => {
    const IDs = utils.generateApps(upsMock, 10);
    const testAppNoVariants = IDs[5];
    const testAppId1 = IDs[2];
    const testAppId8 = IDs[8];

    const variants1 = utils.generateVariants(
      upsMock,
      testAppId1,
      35,
      new Array(35).fill({
        type: 'android',
        googleKey: '123456',
        projectNumber: '1234556',
      } as AndroidVariant)
    );

    const variants8 = utils.generateVariants(
      upsMock,
      testAppId8,
      12,
      new Array(12).fill({
        type: 'ios',
        production: false,
        certificate: '123',
      } as IOSVariant)
    );

    const foundVariants1 = await upsAdminClient.variants.search(testAppId1).execute();
    expect(foundVariants1).toEqual(variants1);

    const foundVariants8 = await upsAdminClient.variants.search(testAppId8).execute();
    expect(foundVariants8).toEqual(variants8);

    const appNoVariants = await upsAdminClient.variants.search(testAppNoVariants).execute();
    expect(appNoVariants).toHaveLength(0);
  });

  it('Should return a given variant', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    const APP_ID = APP_IDS[5];
    const VARIANTS = utils.generateVariants(upsMock, APP_ID, 30);

    const variantToFind = VARIANTS[12];

    const filteredVariants = await upsAdminClient.variants
      .search(APP_ID)
      .withVariantID(variantToFind.variantID)
      .execute();
    expect(filteredVariants).toEqual([variantToFind]);
  });

  it('Should return empty result', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    const APP_ID = APP_IDS[5];
    utils.generateVariants(upsMock, APP_ID, 30);

    const filteredVariants = await upsAdminClient.variants.search(APP_ID).withName("Can't find me").execute();
    expect(filteredVariants).toEqual([]);
  });

  it('Should return all variants of a given type', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    // generate 10 variants for each app
    const variants: Record<string, Variant[]> = {};
    APP_IDS.forEach(id => (variants[id] = utils.generateVariants(upsMock, id, 10)));

    const TEST_APP_ID1 = APP_IDS[3];
    const TEST_APP_ID2 = APP_IDS[8];

    const filteredAndroidVariants = await upsAdminClient.variants.android.search(TEST_APP_ID1).execute();

    const filterediOSVariants = await upsAdminClient.variants.ios.search(TEST_APP_ID2).execute();
    expect(filteredAndroidVariants).toEqual(variants[TEST_APP_ID1].filter(variant => variant.type === 'android'));
    expect(filterediOSVariants).toEqual(variants[TEST_APP_ID2].filter(variant => variant.type === 'ios'));
  });
});
