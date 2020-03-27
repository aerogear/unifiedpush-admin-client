import axios from 'axios';
import { mockData } from '../mockData';
import { VariantsAdmin } from '../../src/variants/VariantsAdmin';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Test finders', () => {
  it('test find without filters', async () => {
    const appId = '1';
    const selectedApp = mockData.filter(app => app.id === appId)[0];
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: selectedApp }));

    const res = await new VariantsAdmin().find(mockedAxios, appId);
    expect(res).toHaveLength(selectedApp!.variants!.length);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/applications/${appId}`);
  });

  it('test find with single filter', async () => {
    const appId = '1';
    const selectedApp = mockData.filter(app => app.id === appId)[0];
    mockedAxios.get.mockImplementation(() => Promise.resolve({ data: selectedApp }));

    let res = await new VariantsAdmin().find(mockedAxios, appId, { developer: 'developer 2' });
    expect(res).toHaveLength(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/applications/${appId}`);

    res = await new VariantsAdmin().find(mockedAxios, appId, { developer: 'developer 1' });
    expect(res).toHaveLength(2);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/applications/${appId}`);
  });

  it('test find one variant/no filters', async () => {
    const appId = '3';
    const selectedApp = mockData.filter(app => app.id === appId)[0];
    mockedAxios.get.mockImplementation(() => Promise.resolve({ data: selectedApp }));

    const res = await new VariantsAdmin().find(mockedAxios, appId);
    expect(res).toHaveLength(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/applications/${appId}`);
  });

  it('test find with bad filter', async () => {
    const appId = '1';
    const selectedApp = mockData.filter(app => app.id === appId)[0];
    mockedAxios.get.mockImplementation(() => Promise.resolve({ data: selectedApp }));

    const res = await new VariantsAdmin().find(mockedAxios, appId, { developer: 'developer 84' });
    expect(res).toHaveLength(0);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/applications/${appId}`);
  });

  it('test app without variants', async () => {
    const appId = '4';
    const selectedApp = mockData.filter(app => app.id === appId)[0];
    mockedAxios.get.mockImplementation(() => Promise.resolve({ data: selectedApp }));

    const res = await new VariantsAdmin().find(mockedAxios, appId, { developer: 'developer 84' });
    expect(res).toHaveLength(0);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/applications/${appId}`);
  });
});
