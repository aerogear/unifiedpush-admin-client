import * as nock from 'nock';
import axios from 'axios';
import {
  BASE_URL,
  mockKeyCloak,
  mockUps,
  TEST_NEW_VARIANT_CREATED,
  TEST_NEW_VARIANT_TO_CREATE,
} from '../mocks/nockMocks';
import {findApplicationByID, mockData} from '../mocks/mockData';
import {VariantsAdmin} from '../../src/variants/VariantsAdmin';
import {IOSVariant} from '../../src/variants';

const TEST_APP_ID = '2:2';
const TEST_VARIANT_ID = 'v-2:2';
const TEST_VARIANT_TYPE = 'android';
const WRONG_NAME = 'WRONG';

beforeAll(() => {
  mockUps();
  mockKeyCloak();
});

afterAll(() => {
  nock.restore();
});

describe('Variants Admin', () => {
  const api = axios.create({baseURL: `${BASE_URL}/rest`});
  const variantAdmin = new VariantsAdmin();

  it(`Should return all variants for app ${TEST_APP_ID}`, async () => {
    const variants = await variantAdmin.find(api, TEST_APP_ID);
    expect(variants).toEqual(mockData.find(app => app.pushApplicationID === TEST_APP_ID)!.variants);
  });

  it('Should return a given variant', async () => {
    const filteredVariants = await variantAdmin.find(api, TEST_APP_ID, {
      variantID: TEST_VARIANT_ID,
    });
    expect(filteredVariants).toEqual([
      mockData
        .find(app => app.pushApplicationID === TEST_APP_ID)!
        .variants!.find(variant => variant.variantID === TEST_VARIANT_ID),
    ]);
  });

  it('Should return empty result', async () => {
    const filteredVariants = await variantAdmin.find(api, TEST_APP_ID, {
      name: WRONG_NAME,
    });
    expect(filteredVariants).toEqual([]);
  });

  it('Should return all variants of a given type', async () => {
    const filteredVariants = await variantAdmin.find(api, TEST_APP_ID, {
      type: TEST_VARIANT_TYPE,
    });
    expect(filteredVariants).toEqual(
      findApplicationByID(TEST_APP_ID)!.variants!.filter(variant => variant.type === TEST_VARIANT_TYPE)
    );
  });

  it('Should create an android variant', async () => {
    const variant = await variantAdmin.create(api, TEST_APP_ID, TEST_NEW_VARIANT_TO_CREATE);
    expect(variant).toEqual(TEST_NEW_VARIANT_CREATED);
  });

  it('Should create an ios variant', async () => {
    const variant = await variantAdmin.create(api, TEST_APP_ID, {
      type: 'ios',
      name: 'test',
      certificate: './test/resource/mockcert.p12',
      password: '123pwd123',
      production: false,
    } as IOSVariant);
    expect(variant).toEqual(TEST_NEW_VARIANT_CREATED);
    jest.restoreAllMocks();
  });

  it('Should delete a variant', async () => {
    await variantAdmin.delete(api, TEST_APP_ID, {
      variantID: 'v-2:2',
    });
    const appDel = mockData.find(appDel => appDel.pushApplicationID === TEST_APP_ID)!;
    const varDel = appDel.variants!.find(variant => variant.variantID === 'v-2:2');
    expect(appDel.variants).not.toContain(varDel);
  });
});
