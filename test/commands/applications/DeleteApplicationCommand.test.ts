import {UpsAdminClient} from '../../../src';
import {createApplications, deleteApplication, getAllApplications, initMockEngine} from '../mocks/UPSMock';
import {UPS_URL} from '../mocks/constants';

beforeEach(() => {
  initMockEngine(UPS_URL);
});

afterAll(() => {});

describe('DeleteApplicationCommand', () => {
  const BASE_URL = 'http://localhost:8888';
  const upsAdminClient = new UpsAdminClient(BASE_URL);

  it('Should delete an app by Id', async () => {
    createApplications({});
    const appToDelete = getAllApplications()[5];

    expect((await upsAdminClient.applications.search().execute()).list).toHaveLength(10);
    expect(
      (await upsAdminClient.applications.search().withApplicationID(appToDelete.pushApplicationID).execute()).list
    ).toHaveLength(1);

    await upsAdminClient.applications.delete().withApplicationID(appToDelete.pushApplicationID).execute();

    expect((await upsAdminClient.applications.search().execute()).list).toHaveLength(9);
    expect(
      (await upsAdminClient.applications.search().withApplicationID(appToDelete.pushApplicationID).execute()).list
    ).toHaveLength(0);
  });

  it('Should silently return an empty list', async () => {
    createApplications({appCount: 1});
    const app = getAllApplications()[0];
    // delete the application so that it doesn't exists anymore
    deleteApplication(app.pushApplicationID);

    const deletedApps = await upsAdminClient.applications.delete().withApplicationID(app.pushApplicationID).execute();

    expect(deletedApps).toEqual([]);
  });
});
