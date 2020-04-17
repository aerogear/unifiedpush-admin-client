import * as nock from 'nock';
import axios from 'axios';
import {BASE_URL, mockKeyCloak, mockUps, NEW_APP, NEW_APP_NAME} from '../mocks/nockMocks';
import {ApplicationsAdmin} from '../../src/applications/ApplicationsAdmin';
import {mockData} from '../mocks/mockData';

beforeAll(() => {
  mockUps();
  mockKeyCloak();
});

afterAll(() => {
  nock.restore();
});

const APP_DEVELOPER_FILTER_OK = 'Test Developer 1';
const APP_DEVELOPER_FILTER_BAD = 'developer 1';

describe('Applications Admin', () => {
  const api = axios.create({baseURL: `${BASE_URL}/rest`});
  const appAdmin = new ApplicationsAdmin();

  it('Should return all apps', async () => {
    const apps = await appAdmin.find(api);
    expect(apps).toEqual(mockData);
  });

  it('Should return a given app', async () => {
    const filteredApp = await appAdmin.find(api, {
      pushApplicationID: '2:2',
    });
    expect(filteredApp).toEqual([mockData.find(app => app.pushApplicationID === '2:2')]);
  });

  it('Should return empty result', async () => {
    const filteredApp = await appAdmin.find(api, {
      developer: APP_DEVELOPER_FILTER_BAD,
    });
    expect(filteredApp).toEqual([]);
  });

  it(`Should return all apps developed by ${APP_DEVELOPER_FILTER_OK}`, async () => {
    const filteredApp = await appAdmin.find(api, {
      developer: APP_DEVELOPER_FILTER_OK,
    });
    expect(filteredApp).toEqual(mockData.filter(app => app.developer === APP_DEVELOPER_FILTER_OK));
  });

  it(`Should return all apps developed by ${APP_DEVELOPER_FILTER_OK}`, async () => {
    const filteredApp = await appAdmin.find(api, {
      developer: APP_DEVELOPER_FILTER_OK,
    });
    expect(filteredApp).toEqual(mockData.filter(app => app.developer === APP_DEVELOPER_FILTER_OK));
  });

  it(`Should create an app named ${NEW_APP_NAME} and should return it.`, async () => {
    const newApp = await appAdmin.create(api, NEW_APP_NAME);
    expect(newApp).toEqual(NEW_APP);
  });
});
