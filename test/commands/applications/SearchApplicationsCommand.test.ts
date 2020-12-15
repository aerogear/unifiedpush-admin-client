import {UpsAdminClient} from '../../../src';
import {createApplications, getAllApplications, initMockEngine} from '../mocks/UPSMock';
import {UPS_URL} from '../mocks/constants';
beforeEach(() => {
  initMockEngine(UPS_URL);
});

describe('SearchApplicationCommand', () => {
  const BASE_URL = 'http://localhost:8888';

  const upsAdminClient = new UpsAdminClient(BASE_URL);

  it('Should return all apps (1st page)', async () => {
    createApplications({appCount: 45});
    const testAppList = getAllApplications();
    const apps = await upsAdminClient.applications.search().withPageSize(10).execute();
    expect(apps.list).toHaveLength(10);
    expect(apps.list).toMatchObject(testAppList.slice(0, 10));

    expect(apps.total as number).toEqual(45);
  });

  it('Should return all apps (2nd page)', async () => {
    createApplications({appCount: 45});

    let apps = await upsAdminClient.applications.search().execute();
    expect(apps.list).toHaveLength(10);
    apps = await upsAdminClient.applications.search().page(1).execute();
    expect(apps.list).toHaveLength(10);
    apps = await upsAdminClient.applications.search().page(2).execute();
    expect(apps.list).toHaveLength(10);
    apps = await upsAdminClient.applications.search().page(3).execute();
    expect(apps.list).toHaveLength(10);
    apps = await upsAdminClient.applications.search().page(4).execute();
    expect(apps.list).toHaveLength(5);
    expect(apps.total).toEqual(45);
  });

  it('Should return all apps (total)', async () => {
    createApplications({appCount: 45});

    const apps = await upsAdminClient.applications.search().page(-1).execute();
    expect(apps.list).toHaveLength(45);
    expect(apps.total).toEqual(45);
  });

  it('Should return a given app', async () => {
    createApplications({appCount: 10});
    // get one app
    const app = (await upsAdminClient.applications.search().execute()).list[6];

    const filteredApp = await upsAdminClient.applications.search().withApplicationID(app.pushApplicationID).execute();

    expect(filteredApp.list).toEqual([app]);
    expect(filteredApp.total).toEqual(1);
  });

  it('Should find app by name', async () => {
    createApplications({appCount: 45});
    const testApp = getAllApplications()[38];
    // get one app
    const app = await upsAdminClient.applications.search().withName(testApp.name).execute();

    expect(app.list).toHaveLength(1);
    expect(app.total).toEqual(1);
  });

  it('Should return empty result', async () => {
    const filteredApp = await upsAdminClient.applications.search().withDeveloper('WRONG VALUE').execute();

    expect(filteredApp.list).toEqual([]);
  });

  it("Should return all apps developed by 'TEST_DEVELOPER'", async () => {
    const DEVELOPER = 'TEST_DEVELOPER';
    createApplications({appCount: 8, appDef: {developer: DEVELOPER}});
    createApplications({appCount: 10, appDef: {developer: 'Dev 1'}});
    createApplications({appCount: 5, appDef: {developer: 'Dev 2'}});

    const filteredApp = await upsAdminClient.applications.search().withDeveloper(DEVELOPER).execute();
    expect(filteredApp.list).toHaveLength(8);
    expect(filteredApp.list).toMatchObject(new Array(8).fill({developer: DEVELOPER}));
  });
});
