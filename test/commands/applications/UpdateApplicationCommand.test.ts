import {UpsAdminClient} from '../../../src';
import {UPSMock, utils} from '../../mocks';
import {VariantDefinition} from '../../../src/commands/variants/Variant';

const BASE_URL = 'http://localhost:8888';

const upsMock = new UPSMock();

beforeEach(() => {
  upsMock.reset();
});

afterAll(() => {
  upsMock.uninstall();
});

describe('UpdateApplicationCommand', () => {
  const upsAdminClient = new UpsAdminClient(BASE_URL);

  it('Should rename the application.', async () => {
    const IDS = utils.generateApps(upsMock, 59);
    const appId = IDS[52];
    upsMock.getImpl().getApplications(appId);

    const newName = 'NEW APP NAME';

    expect((await upsAdminClient.applications.search().withApplicationID(appId).execute()).list[0].name).not.toEqual(
      newName
    );

    await upsAdminClient.applications.update(appId).withName(newName).execute();

    expect((await upsAdminClient.applications.search().withApplicationID(appId).execute()).list[0].name).toEqual(
      newName
    );
  });

  it('Should update the description.', async () => {
    const IDS = utils.generateApps(upsMock, 59);
    const appId = IDS[52];
    upsMock.getImpl().getApplications(appId);

    const newDescription = 'Description Nr1';

    expect(
      (await upsAdminClient.applications.search().withApplicationID(appId).execute()).list[0].description
    ).not.toEqual(newDescription);

    await upsAdminClient.applications.update(appId).withDescription(newDescription).execute();

    expect((await upsAdminClient.applications.search().withApplicationID(appId).execute()).list[0].description).toEqual(
      newDescription
    );
  });

  it('Should update using a template.', async () => {
    const IDS = utils.generateApps(upsMock, 59);
    const appId = IDS[52];
    upsMock.getImpl().getApplications(appId);

    const newDescription = 'NEW DESC';
    const newName = 'NEW NAME';

    const updateTemplate: VariantDefinition = {
      description: newDescription,
      name: newName,
    };

    await upsAdminClient.applications.update(appId).withDefinition(updateTemplate).execute();

    const app = (await upsAdminClient.applications.search().withApplicationID(appId).execute()).list[0];

    expect(app.description).toEqual(newDescription);
    expect(app.name).toEqual(newName);
  });
});
