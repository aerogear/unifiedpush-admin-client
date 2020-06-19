import axios from 'axios';
import {VariantsAdmin} from '../../src/variants/VariantsAdmin';
import {AndroidVariant, IOSVariant, Variant} from '../../src/variants';
import {UPSMock, utils} from '../mocks';
import {VariantUpdate} from '../../src/variants/Variant';

const TEST_APP_ID = '2:2';
const BASE_URL = 'http://localhost:8888';

const upsMock = new UPSMock();

beforeEach(() => {
  upsMock.reset();
});

afterAll(() => {
  upsMock.uninstall();
});

describe('Variants Admin', () => {
  const api = axios.create({baseURL: `${BASE_URL}/rest`});
  const variantAdmin = new VariantsAdmin();

  it('Should create an android variant', async () => {
    const TEST_NEW_VARIANT_TO_CREATE = {
      name: 'TestAndroid',
      googleKey: '123GOOGLE456',
      projectNumber: '123PRJ456',
      type: 'android',
    } as AndroidVariant;

    const IDs = utils.generateIDs(10);
    utils.generateApps(
      upsMock,
      10,
      IDs.map(id => ({pushApplicationID: id}))
    );

    const appId = IDs[7];

    const variant = await variantAdmin.create(api, appId, TEST_NEW_VARIANT_TO_CREATE);
    expect(variant).toMatchObject(TEST_NEW_VARIANT_TO_CREATE);
  });

  it('Should create an ios variant', async () => {
    const IDs = utils.generateIDs(10);
    utils.generateApps(
      upsMock,
      10,
      IDs.map(id => ({pushApplicationID: id}))
    );

    const appId = IDs[7];

    const IOSVARIANT = {
      type: 'ios',
      name: 'test',
      certificate: './test/resource/mockcert.p12',
      password: '123pwd123',
      production: false,
    } as IOSVariant;

    const variant = await variantAdmin.create(api, appId, IOSVARIANT);
    expect(variant.name).toEqual(IOSVARIANT.name);
  });

  it(`Should return all variants for app ${TEST_APP_ID}`, async () => {
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

    const foundVariants1 = await variantAdmin.find(api, testAppId1);
    expect(foundVariants1).toEqual(variants1);

    const foundVariants8 = await variantAdmin.find(api, testAppId8);
    expect(foundVariants8).toEqual(variants8);

    const appNoVariants = await variantAdmin.find(api, testAppNoVariants);
    expect(appNoVariants).toHaveLength(0);
  });

  it('Should return a given variant', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    const APP_ID = APP_IDS[5];
    const VARIANTS = utils.generateVariants(upsMock, APP_ID, 30);

    const variantToFind = VARIANTS[12];

    const filteredVariants = await variantAdmin.find(api, APP_ID, {
      variantID: variantToFind.variantID,
    });
    expect(filteredVariants).toEqual([variantToFind]);
  });

  it('Should return empty result', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    const APP_ID = APP_IDS[5];
    utils.generateVariants(upsMock, APP_ID, 30);

    const filteredVariants = await variantAdmin.find(api, TEST_APP_ID, {
      name: "Can't find me",
    });
    expect(filteredVariants).toEqual([]);
  });

  it('Should return all variants of a given type', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    // generate 10 variants for each app
    const variants: Record<string, Variant[]> = {};
    APP_IDS.forEach(id => (variants[id] = utils.generateVariants(upsMock, id, 10)));

    const TEST_APP_ID1 = APP_IDS[3];
    const TEST_APP_ID2 = APP_IDS[8];

    const filteredAndroidVariants = await variantAdmin.find(api, TEST_APP_ID1, {
      type: 'android',
    });
    const filterediOSVariants = await variantAdmin.find(api, TEST_APP_ID2, {
      type: 'ios',
    });
    expect(filteredAndroidVariants).toEqual(variants[TEST_APP_ID1].filter(variant => variant.type === 'android'));
    expect(filterediOSVariants).toEqual(variants[TEST_APP_ID2].filter(variant => variant.type === 'ios'));
  });

  it('Should delete a variant', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    // generate 10 variants for each app
    const variants: Record<string, Variant[]> = {};
    APP_IDS.forEach(id => (variants[id] = utils.generateVariants(upsMock, id, 10)));

    const appId = APP_IDS[3];
    const variantToDelete = variants[appId][4];

    // Ensure the variant exists now
    expect(await variantAdmin.find(api, appId, {variantID: variantToDelete.variantID})).toEqual([variantToDelete]);

    // Delete the variant
    await variantAdmin.delete(api, appId, {variantID: variantToDelete.variantID});

    // Ensure the variant does not exists anymore
    expect(await variantAdmin.find(api, appId, {variantID: variantToDelete.variantID})).toHaveLength(0);
  });

  it('Should renew a variant secret', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    const APP_ID = APP_IDS[5];
    const VARIANTS = utils.generateVariants(upsMock, APP_ID, 30);

    const variantToRenew = VARIANTS[12];
    const oldSecret = variantToRenew.secret;

    const renewedVariant = await variantAdmin.renewSecret(api, APP_ID, variantToRenew.type, variantToRenew.variantID!);
    const newSecret = renewedVariant.secret;

    expect(renewedVariant.variantID).toEqual(variantToRenew.variantID);
    expect(newSecret).toBeDefined();
    expect(oldSecret).not.toEqual(renewedVariant.secret);
  });

  it('Should return a 404', async () => {
    const APP_IDS = utils.generateApps(upsMock, 10);
    const APP_ID = APP_IDS[5];
    utils.generateVariants(upsMock, APP_ID, 30);

    await expect(variantAdmin.renewSecret(api, APP_ID, 'android', 'bad id')).rejects.toThrow(
      'Request failed with status code 404'
    );
  });

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

    await variantAdmin.update(api, APP_ID, update);

    const updatedVariant = (await variantAdmin.find(api, APP_ID, {variantID: variantToUpdate.variantID}))[0];

    expect(updatedVariant.name).toEqual(newName);
  });
});
