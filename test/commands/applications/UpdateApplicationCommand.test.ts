import {UpsAdminClient} from '../../../src';
import {VariantDefinition} from '../../../src/commands/variants/Variant';
import {UPS_URL} from '../mocks/constants';
import {createApplications, getAllApplications, initMockEngine} from '../mocks/UPSMock';

beforeEach(() => {
  initMockEngine(UPS_URL);
});

describe('UpdateApplicationCommand', () => {
  const upsAdminClient = new UpsAdminClient(UPS_URL);

  it('Should rename the application.', async () => {
    createApplications({appCount: 59});
    const testApp = getAllApplications()[52];

    const newName = 'NEW APP NAME';

    expect(
      (await upsAdminClient.applications.search().withApplicationID(testApp.pushApplicationID).execute()).list[0].name
    ).not.toEqual(newName);

    await upsAdminClient.applications.update(testApp.pushApplicationID).withName(newName).execute();

    expect(
      (await upsAdminClient.applications.search().withApplicationID(testApp.pushApplicationID).execute()).list[0].name
    ).toEqual(newName);
  });

  it('Should update the description.', async () => {
    createApplications({appCount: 59});
    const testApp = getAllApplications()[52];

    const newDescription = 'Description Nr1';

    expect(
      (await upsAdminClient.applications.search().withApplicationID(testApp.pushApplicationID).execute()).list[0]
        .description
    ).not.toEqual(newDescription);

    await upsAdminClient.applications.update(testApp.pushApplicationID).withDescription(newDescription).execute();

    expect(
      (await upsAdminClient.applications.search().withApplicationID(testApp.pushApplicationID).execute()).list[0]
        .description
    ).toEqual(newDescription);
  });

  it('Should update using a template.', async () => {
    createApplications({appCount: 59});
    const testApp = getAllApplications()[52];

    const newDescription = 'NEW DESC';
    const newName = 'NEW NAME';

    const updateTemplate: VariantDefinition = {
      description: newDescription,
      name: newName,
    };

    await upsAdminClient.applications.update(testApp.pushApplicationID).withDefinition(updateTemplate).execute();

    const app = (await upsAdminClient.applications.search().withApplicationID(testApp.pushApplicationID).execute())
      .list[0];

    expect(app.description).toEqual(newDescription);
    expect(app.name).toEqual(newName);
  });
});
