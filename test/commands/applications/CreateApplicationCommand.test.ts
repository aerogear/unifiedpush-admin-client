import {AndroidVariantDefinition, UpsAdminClient} from '../../../src';
import {initMockEngine} from '../mocks/UPSMock';
import {UPS_URL} from '../mocks/constants';

beforeEach(() => {
  initMockEngine(UPS_URL);
});

describe('CreateApplicationCommand', () => {
  const NEW_APP_NAME = 'TEST APP';
  const BASE_URL = 'http://localhost:8888';

  const upsAdminClient = new UpsAdminClient(BASE_URL);

  it(`Should create an app named ${NEW_APP_NAME} and should return it.`, async () => {
    const newApp = await upsAdminClient.applications
      .create(NEW_APP_NAME)
      .withDescription('My great new app')
      .withDeveloper('TESTDEVELOPER')
      .execute();

    expect(newApp.name).toEqual(NEW_APP_NAME);

    const allApps = (await upsAdminClient.applications.search().execute()).list;
    expect(allApps).toHaveLength(1);
    expect(allApps[0].name).toEqual(NEW_APP_NAME);
  });

  it('Should create an app using a template.', async () => {
    const appTemplate = {
      name: 'MyNew App',
      type: 'android',
      googleKey: 'New googlekey',
      projectNumber: 'New projectnr',
    } as AndroidVariantDefinition;

    const newApp = await upsAdminClient.applications.create(NEW_APP_NAME).withDefinition(appTemplate).execute();

    expect(newApp.name).toEqual(appTemplate.name);

    const allApps = (await upsAdminClient.applications.search().execute()).list;
    expect(allApps).toHaveLength(1);
    expect(allApps[0].name).toEqual(appTemplate.name);
  });
});
