import {UpsAdminClient} from '../../../src';
import {UPSMock, utils} from '../../mocks';

const upsMock = new UPSMock();

beforeEach(() => {
  upsMock.reset();
});

afterAll(() => {
  upsMock.uninstall();
});

describe('SearchApplicationCommand', () => {
  const BASE_URL = 'http://localhost:8888';

  const upsAdminClient = new UpsAdminClient(BASE_URL);

  it('Should return all apps (1st page)', async () => {
    const ids = utils.generateIDs(45).map(id => ({pushApplicationID: id}));
    utils.generateApps(upsMock, 45, ids);

    ids.forEach(id => utils.generateVariants(upsMock, id.pushApplicationID, 10));

    const apps = await upsAdminClient.applications.search().withPageSize(10).execute();
    expect(apps.list).toHaveLength(10);
    expect(apps.list).toMatchObject(ids.slice(0, 10));

    expect(apps.total as number).toEqual(45);
  });

  it('Should return all apps (2nd page)', async () => {
    utils.generateApps(upsMock, 45);

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

  it('Should return a given app', async () => {
    utils.generateApps(upsMock, 10);
    // get one app
    const app = (await upsAdminClient.applications.search().execute()).list[6];

    const filteredApp = await upsAdminClient.applications.search().withApplicationID(app.pushApplicationID).execute();

    expect(filteredApp.list).toEqual([app]);
    expect(filteredApp.total).toEqual(1);
  });

  it('Should find app by name', async () => {
    utils.generateApps(upsMock, 45);
    utils.generateApps(upsMock, 1, [{name: 'TEST'}]);
    // get one app
    const app = await upsAdminClient.applications.search().withName('TEST').execute();

    expect(app.list).toHaveLength(1);
    expect(app.total).toEqual(1);
  });

  it('Should return empty result', async () => {
    const filteredApp = await upsAdminClient.applications.search().withDeveloper('WRONG VALUE').execute();

    expect(filteredApp.list).toEqual([]);
  });

  it("Should return all apps developed by 'TEST_DEVELOPER'", async () => {
    const DEVELOPER = 'TEST_DEVELOPER';
    utils.generateApps(upsMock, 8, new Array(20).fill({developer: DEVELOPER}));
    utils.generateApps(upsMock, 10, new Array(10).fill({developer: 'Dev 1'}));
    utils.generateApps(upsMock, 5, new Array(10).fill({developer: 'Dev 2'}));

    const filteredApp = await upsAdminClient.applications.search().withDeveloper(DEVELOPER).execute();
    expect(filteredApp.list).toHaveLength(8);
    expect(filteredApp.list).toMatchObject(new Array(8).fill({developer: DEVELOPER}));
  });
});
