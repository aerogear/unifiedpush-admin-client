import {UpsAdminClient} from '../../../src';
import {UPS_URL} from '../mocks/constants';
import {createApplications, createMetrics, getAllApplications, getAppMetrics, initMockEngine} from '../mocks/UPSMock';

beforeEach(() => {
  initMockEngine(UPS_URL);
});

describe('LoadMetricsCommand', () => {
  const upsAdminClient = new UpsAdminClient(UPS_URL);
  it('Should load application metrics (1st page, pagesize 10)', async () => {
    createApplications();
    const testApp = getAllApplications()[9];
    createMetrics({appId: testApp.pushApplicationID, count: 45});
    const testAppMetrics = getAppMetrics(testApp.pushApplicationID, 0, 10, 'desc', '');

    const expectedMetrics = {
      list: testAppMetrics,
      total: getAppMetrics(testApp.pushApplicationID).length,
    };
    expectedMetrics.list = getAppMetrics(testApp.pushApplicationID, 0);
    const metrics = await upsAdminClient.applications.metrics(testApp.pushApplicationID).execute();
    expect(metrics.list.length).toBe(10);
    expect(metrics).toMatchObject(expectedMetrics);
  });

  it('Should load application metrics (last page, pagesize 10)', async () => {
    createApplications();
    const testApp = getAllApplications()[9];
    createMetrics({appId: testApp.pushApplicationID, count: 45});

    const expectedMetrics = {
      list: getAppMetrics(testApp.pushApplicationID, 4, 10, 'desc', ''),
      total: getAppMetrics(testApp.pushApplicationID).length,
    };

    const metrics = await upsAdminClient.applications.metrics(testApp.pushApplicationID).withPage(4).execute();
    expect(metrics.list.length).toBe(5);
    expect(metrics).toMatchObject(expectedMetrics);
  });

  it('Should load application metrics (1st page, pagesize 5)', async () => {
    createApplications();
    const testApp = getAllApplications()[9];
    createMetrics({appId: testApp.pushApplicationID, count: 45});

    const expectedMetrics = {
      list: getAppMetrics(testApp.pushApplicationID, 0, 5),
      total: getAppMetrics(testApp.pushApplicationID).length,
    };
    const metrics = await upsAdminClient.applications.metrics(testApp.pushApplicationID).withPageSize(5).execute();
    expect(metrics.list.length).toBe(5);
    expect(metrics).toMatchObject(expectedMetrics);
  });

  it('Should load application metrics (last page, pagesize 5)', async () => {
    createApplications();
    const testApp = getAllApplications()[9];
    createMetrics({appId: testApp.pushApplicationID, count: 47});

    const expectedMetrics = {
      list: getAppMetrics(testApp.pushApplicationID, 5, 9),
      total: getAppMetrics(testApp.pushApplicationID).length,
    };
    const metrics = await upsAdminClient.applications
      .metrics(testApp.pushApplicationID)
      .withPage(9)
      .withPageSize(5)
      .execute();
    expect(metrics.list.length).toBe(2);
    expect(metrics).toMatchObject(expectedMetrics);
  });
});
