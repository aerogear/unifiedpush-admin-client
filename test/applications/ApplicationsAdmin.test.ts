import axios from 'axios';
import {ApplicationsAdmin} from '../../src/applications/ApplicationsAdmin';

import {UPSMock, utils} from '../mocks';
import {PushApplication} from '../../src/applications';

const BASE_URL = 'http://localhost:8888';
const APP_DEVELOPER_FILTER_OK = 'Test Developer 1';
const APP_DEVELOPER_FILTER_BAD = 'developer 1';

const upsMock = new UPSMock();

const NEW_APP_NAME = 'Test Application 1';

beforeEach(() => {
  upsMock.reset();
});

afterAll(() => {
  upsMock.uninstall();
});

describe('Applications Admin', () => {
  const api = axios.create({baseURL: `${BASE_URL}/rest`});
  const appAdmin = new ApplicationsAdmin();

  it(`Should create an app named ${NEW_APP_NAME} and should return it.`, async () => {
    const newApp = await appAdmin.create(api, NEW_APP_NAME);
    expect(newApp.name).toEqual(NEW_APP_NAME);

    const allApps = await appAdmin.find(api);
    expect(allApps).toHaveLength(1);
    expect(allApps[0].name).toEqual(NEW_APP_NAME);
  });

  it('Should rename the application.', async () => {
    const IDS = utils.generateApps(upsMock, 59);
    const appId = IDS[52];
    upsMock.getImpl().getApplications(appId);

    const newName = 'NEW APP NAME';

    expect((await appAdmin.find(api, {filter: {pushApplicationID: appId}}))[0].name).not.toEqual(newName);

    await appAdmin.update(api, {pushApplicationID: appId, name: newName} as PushApplication);

    expect((await appAdmin.find(api, {filter: {pushApplicationID: appId}}))[0].name).toEqual(newName);
  });

  it('Should return all apps (1st page)', async () => {
    const ids = utils.generateIDs(45).map(id => ({pushApplicationID: id}));
    utils.generateApps(upsMock, 45, ids);

    const apps = await appAdmin.find(api);
    expect(apps).toHaveLength(10);
    expect(apps).toMatchObject(ids.slice(0, 10));
  });

  it('Should return all apps (2nd page)', async () => {
    utils.generateApps(upsMock, 45);

    let apps = await appAdmin.find(api);
    expect(apps).toHaveLength(10);
    apps = await appAdmin.find(api, {page: 1});
    expect(apps).toHaveLength(10);
    apps = await appAdmin.find(api, {page: 2});
    expect(apps).toHaveLength(10);
    apps = await appAdmin.find(api, {page: 3});
    expect(apps).toHaveLength(10);
    apps = await appAdmin.find(api, {page: 4});
    expect(apps).toHaveLength(5);
  });

  it('Should return a given app', async () => {
    utils.generateApps(upsMock, 10);
    // get one app
    const app = (await appAdmin.find(api))[6];

    const filteredApp = await appAdmin.find(api, {
      filter: {pushApplicationID: app.pushApplicationID},
    });
    expect(filteredApp).toEqual([app]);
  });

  it('Should find app by name', async () => {
    utils.generateApps(upsMock, 45);
    utils.generateApps(upsMock, 1, [{name: 'TEST'}]);
    // get one app
    const app = await appAdmin.find(api, {filter: {name: 'TEST'}});

    expect(app).toHaveLength(1);
  });

  it('Should return empty result', async () => {
    const filteredApp = await appAdmin.find(api, {
      filter: {developer: APP_DEVELOPER_FILTER_BAD},
    });
    expect(filteredApp).toEqual([]);
  });

  it(`Should return all apps developed by ${APP_DEVELOPER_FILTER_OK}`, async () => {
    utils.generateApps(upsMock, 8, new Array(20).fill({developer: APP_DEVELOPER_FILTER_OK}));
    utils.generateApps(upsMock, 10, new Array(10).fill({developer: 'Dev 1'}));
    utils.generateApps(upsMock, 5, new Array(10).fill({developer: 'Dev 2'}));

    const filteredApp = await appAdmin.find(api, {
      filter: {developer: APP_DEVELOPER_FILTER_OK},
    });
    expect(filteredApp).toHaveLength(8);
    expect(filteredApp).toMatchObject(new Array(8).fill({developer: APP_DEVELOPER_FILTER_OK}));
  });

  it('Should delete an app using the Id ', async () => {
    const ids = utils.generateIDs(10).map(id => ({pushApplicationID: id}));
    await utils.generateApps(upsMock, 10, ids);

    const idToDelete = ids[5];

    expect(await appAdmin.find(api)).toHaveLength(10);
    expect(await appAdmin.find(api, {filter: idToDelete})).toHaveLength(1);

    await appAdmin.delete(api, idToDelete);

    expect(await appAdmin.find(api)).toHaveLength(9);
    expect(await appAdmin.find(api, {filter: idToDelete})).toHaveLength(0);
  });
});
