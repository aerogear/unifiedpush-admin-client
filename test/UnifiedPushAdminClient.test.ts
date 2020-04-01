import axios from 'axios';
import { mockData } from './mockData';
import { PushApplication, UnifiedPushAdminClient } from '../src';
import { mocked } from 'ts-jest/dist/util/testing';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

mocked(axios).create = () => mockedAxios;

const upsClient = new UnifiedPushAdminClient('http://localhost:9999');

describe('Applications Admin', () => {
  it('test find without filters', async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockData }));

    const res = await new UnifiedPushAdminClient('http://localhost:9999').applications.find();
    expect(res).toHaveLength(mockData.length);
    expect(mockedAxios.get).toHaveBeenCalledWith('/applications');
  });
  it('test filter by id - returning singe result', async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockData.find(value => value.id === '2') }));

    const res = await new UnifiedPushAdminClient('http://localhost:9999').applications.find({
      id: '2',
    });
    expect(res).toHaveLength(1);
    expect(mockedAxios.get).toHaveBeenCalledWith('/applications/2');
  });

  it('test filter by id - returning array with one object', async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: [mockData.find(value => value.id === '2')] }));

    const res = await new UnifiedPushAdminClient('http://localhost:9999').applications.find({
      id: '2',
    });
    expect(res).toHaveLength(1);
    expect(mockedAxios.get).toHaveBeenCalledWith('/applications/2');
  });

  it('test find filter by Developer', async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockData }));

    const res = await new UnifiedPushAdminClient('http://localhost:9999').applications.find({
      developer: 'Test Developer 2',
    });
    expect(res).toHaveLength(2);
    expect(mockedAxios.get).toHaveBeenCalledWith('/applications');
  });

  it('test find filter by name', async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockData }));

    const res = await new UnifiedPushAdminClient('http://localhost:9999').applications.find({
      name: 'Application 3',
    });
    expect(res).toHaveLength(1);
    expect(res[0]).toEqual(mockData.find(app => app.name === 'Application 3'));
    expect(mockedAxios.get).toHaveBeenCalledWith('/applications');
  });

  it('test find with multiple filter', async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockData }));

    const res = await new UnifiedPushAdminClient('http://localhost:9999').applications.find({
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

    const res = await new UnifiedPushAdminClient('http://localhost:9999').applications.create(appToBeCreated.name);
    expect(res).toEqual({ name: appToBeCreated.name });
    expect(mockedAxios.post).toHaveBeenCalledWith('/applications', { name: appToBeCreated.name });
  });
});

describe('Variants Admin', () => {
  it('test find without filters', async () => {
    const appId = '1';
    const selectedApp = mockData.filter(app => app.id === appId)[0];
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: selectedApp }));

    const res = await upsClient.variants.find(appId);
    expect(res).toHaveLength(selectedApp!.variants!.length);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/applications/${appId}`);
  });

  it('test filter by type', async () => {
    const appId = '1';
    const selectedApp = mockData.filter(app => app.id === appId)[0];
    mockedAxios.get.mockImplementation(() =>
      Promise.resolve({ data: selectedApp.variants!.filter(variant => variant.type === 'android') })
    );

    const res = await upsClient.variants.find(appId, { type: 'android' });
    expect(res).toHaveLength(1);
    expect(res[0].type).toEqual('android');
    expect(res[0].name).toEqual('Variant 1');
    expect(mockedAxios.get).toHaveBeenCalledWith(`/applications/${appId}/android`);
  });

  it('test find with single filter', async () => {
    const appId = '1';
    const selectedApp = mockData.filter(app => app.id === appId)[0];
    mockedAxios.get.mockImplementation(() => Promise.resolve({ data: selectedApp }));

    let res = await upsClient.variants.find(appId, { developer: 'developer 2' });
    expect(res).toHaveLength(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/applications/${appId}`);

    res = await upsClient.variants.find(appId, { developer: 'developer 1' });
    expect(res).toHaveLength(2);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/applications/${appId}`);
  });

  it('test find one variant/no filters', async () => {
    const appId = '3';
    const selectedApp = mockData.filter(app => app.id === appId)[0];
    mockedAxios.get.mockImplementation(() => Promise.resolve({ data: selectedApp }));

    const res = await upsClient.variants.find(appId);
    expect(res).toHaveLength(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/applications/${appId}`);
  });

  it('test find with bad filter', async () => {
    const appId = '1';
    const selectedApp = mockData.filter(app => app.id === appId)[0];
    mockedAxios.get.mockImplementation(() => Promise.resolve({ data: selectedApp }));

    const res = await upsClient.variants.find(appId, { developer: 'developer 84' });
    expect(res).toHaveLength(0);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/applications/${appId}`);
  });

  it('test app without variants', async () => {
    const appId = '4';
    const selectedApp = mockData.filter(app => app.id === appId)[0];
    mockedAxios.get.mockImplementation(() => Promise.resolve({ data: selectedApp }));

    const res = await upsClient.variants.find(appId, { developer: 'developer 84' });
    expect(res).toHaveLength(0);
    expect(mockedAxios.get).toHaveBeenCalledWith(`/applications/${appId}`);
  });
});
