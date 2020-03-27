import axios from 'axios';
import { ApplicationsAdmin } from '../../src/applications/ApplicationsAdmin';
import { PushApplication } from '../../src/applications';
import { mockData } from '../mockData';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ApplicationsAdmin', () => {
  it('test find without filters', async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockData }));

    const res = await new ApplicationsAdmin().find(mockedAxios);
    expect(res).toHaveLength(mockData.length);
    expect(mockedAxios.get).toHaveBeenCalledWith('/applications');
  });
  it('test find with single filter', async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockData }));

    const res = await new ApplicationsAdmin().find(mockedAxios, { developer: 'Test Developer 2' });
    expect(res).toHaveLength(2);
    expect(mockedAxios.get).toHaveBeenCalledWith('/applications');
  });
  it('test find with multiple filter', async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockData }));

    const res = await new ApplicationsAdmin().find(mockedAxios, {
      developer: 'Test Developer 2',
      name: 'Application 4',
    });
    expect(res).toHaveLength(1);
    expect(res[0].name).toEqual('Application 4');
    expect(mockedAxios.get).toHaveBeenCalledWith('/applications');
  });

  it('test create app', async () => {
    const appToBeCreated = mockData[3];
    mockedAxios.post.mockImplementationOnce((url: string, app: PushApplication) => Promise.resolve({ data: app }));

    const res = await new ApplicationsAdmin().create(mockedAxios, appToBeCreated);
    expect(res).toEqual(appToBeCreated);
    expect(mockedAxios.post).toHaveBeenCalledWith('/applications', appToBeCreated);
  });
});
