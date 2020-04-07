<<<<<<< HEAD
import axios from 'axios';
import { mockData } from './mockData';
import { PushApplication, UnifiedPushAdminClient } from '../src';
import { mocked } from 'ts-jest/dist/util/testing';
import { VariantsAdmin } from '../src/variants/VariantsAdmin';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

mocked(axios).create = () => mockedAxios;

const upsClient = new UnifiedPushAdminClient('http://localhost:9999');

describe('Applications Admin', () => {
  it('test find without filters', async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockData }));

    const res = await new UnifiedPushAdminClient('http://localhost:9999').applications.find();
    expect(res).toHaveLength(mockData.length);
    expect(mockedAxios.get).toHaveBeenCalledWith('/applications');
  });
  it('test filter by id - returning singe result', async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockData.find(value => value.id === '2') }));

    const res = await new UnifiedPushAdminClient('http://localhost:9999').applications.find({
      id: '2',
    });
    expect(res).toHaveLength(1);
    expect(mockedAxios.get).toHaveBeenCalledWith('/applications/2');
  });

  it('test filter by id - returning array with one object', async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: [mockData.find(value => value.id === '2')] }));

    const res = await new UnifiedPushAdminClient('http://localhost:9999').applications.find({
      id: '2',
    });
    expect(res).toHaveLength(1);
    expect(mockedAxios.get).toHaveBeenCalledWith('/applications/2');
  });

  it('test find filter by Developer', async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockData }));

    const res = await new UnifiedPushAdminClient('http://localhost:9999').applications.find({
      developer: 'Test Developer 2',
    });
    expect(res).toHaveLength(2);
    expect(mockedAxios.get).toHaveBeenCalledWith('/applications');
  });

  it('test find filter by name', async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockData }));

    const res = await new UnifiedPushAdminClient('http://localhost:9999').applications.find({
      name: 'Application 3',
    });
    expect(res).toHaveLength(1);
    expect(res[0]).toEqual(mockData.find(app => app.name === 'Application 3'));
    expect(mockedAxios.get).toHaveBeenCalledWith('/applications');
  });

  it('test find with multiple filter', async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockData }));

    const res = await new UnifiedPushAdminClient('http://localhost:9999').applications.find({
      developer: 'Test Developer 2',
      name: 'Application 4',
    });
    expect(res).toHaveLength(1);
    expect(res[0].name).toEqual('Application 4');
    expect(mockedAxios.get).toHaveBeenCalledWith('/applications');
  });

  it('test create app', async () => {
    const appToBeCreated = mockData[3];
    mockedAxios.post.mockImplementationOnce((url: string, app: PushApplication) => Promise.resolve({ data: app }));

    const res = await new UnifiedPushAdminClient('http://localhost:9999').applications.create(appToBeCreated.name);
    expect(res).toEqual({ name: appToBeCreated.name });
    expect(mockedAxios.post).toHaveBeenCalledWith('/applications', { name: appToBeCreated.name });
  });
=======
import * as nock from 'nock';
import {
  BASE_URL,
  KC_CREDENTIALS,
  KEYCLOAK_URL,
  mockKeyCloak,
  mockUps,
  NEW_APP,
  NEW_APP_NAME,
  TEST_NEW_VARIANT_CREATED,
  TEST_NEW_VARIANT_TO_CREATE,
} from './mocks/nockMocks';
import { UnifiedPushAdminClient } from '../src';
import { mockData } from './mocks/mockData';
import { KeycloakCredentials } from '../src/UnifiedPushAdminClient';

beforeAll(() => {
  mockUps(BASE_URL, true);
  mockKeyCloak();
>>>>>>> bc6556cd51d0c7d51347baadc7256ea4cfbbb345
});

afterAll(() => {
  nock.restore();
});

const TEST_APP_ID = '2:2';

describe('UnifiedPushAdminClient', () => {
  const credentials: KeycloakCredentials = {
    kcUrl: KEYCLOAK_URL,
    ...KC_CREDENTIALS,
    type: 'keycloak',
  };

  it('Should return all apps', async () => {
    const apps = await new UnifiedPushAdminClient(BASE_URL, credentials).applications.find();
    expect(apps).toEqual(mockData);
  });

  it('Should create app', async () => {
    const app = await new UnifiedPushAdminClient(BASE_URL, credentials).applications.create(NEW_APP_NAME);
    expect(app).toEqual(NEW_APP);
  });

  it('Should find all variants', async () => {
    const variants = await new UnifiedPushAdminClient(BASE_URL, credentials).variants.find(TEST_APP_ID);
    expect(variants).toEqual(mockData.find(app => app.pushApplicationID === TEST_APP_ID)!.variants);
  });

  it('Should create an android variant', async () => {
    const variant = await new UnifiedPushAdminClient(BASE_URL, credentials).variants.create(
      TEST_APP_ID,
      TEST_NEW_VARIANT_TO_CREATE
    );
    expect(variant).toEqual(TEST_NEW_VARIANT_CREATED);
  });
  //test deletion
  it('test delete variants', async () => {
    const appId = '1';
    const selectedApp = mockData.filter(app => app.id === appId)[0];
    mockedAxios.delete.mockImplementation(() =>
      Promise.resolve({ data: selectedApp.variants!.filter(variant => variant.variantID === 'v-1:2') })
    );
    const expected = { variantID: 'v-1:2' };
    const del = await upsClient.variants.delete(appId, { variantID: 'v-1:2' });
    expect({ data: selectedApp.variants }).toEqual(expect.not.objectContaining(expected));
    console.log({ data: selectedApp.variants });
    console.log(del);
  });
});
