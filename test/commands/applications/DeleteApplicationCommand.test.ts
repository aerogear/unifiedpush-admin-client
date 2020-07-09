import {UpsAdminClient} from '../../../src';
import {UPSMock, utils} from '../../mocks';

const upsMock = new UPSMock();

beforeEach(() => {
  upsMock.reset();
});

afterAll(() => {
  upsMock.uninstall();
});

describe('DeleteApplicationCommand', () => {
  const BASE_URL = 'http://localhost:8888';
  const upsAdminClient = new UpsAdminClient(BASE_URL);

  it('Should delete an app by Id', async () => {
    const ids = utils.generateIDs(10).map(id => ({pushApplicationID: id}));
    utils.generateApps(upsMock, 10, ids);

    const idToDelete = ids[5].pushApplicationID;

    expect((await upsAdminClient.applications.search().execute()).list).toHaveLength(10);
    expect((await upsAdminClient.applications.search().withApplicationID(idToDelete).execute()).list).toHaveLength(1);

    await upsAdminClient.applications.delete().withApplicationID(idToDelete).execute();

    expect((await upsAdminClient.applications.search().execute()).list).toHaveLength(9);
    expect((await upsAdminClient.applications.search().withApplicationID(idToDelete).execute()).list).toHaveLength(0);
  });
});
