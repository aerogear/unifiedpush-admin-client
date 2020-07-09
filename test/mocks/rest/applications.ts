import * as nock from 'nock';
import {UPSEngineMock} from '../engine/UPSEngineMock';
import {ACCESS_TOKEN} from './keycloak';
import {URL} from 'url';
import {PushApplication} from '../../../src/commands/applications';

const REST_APPLICATIONS_ENDPOINT = '/rest/applications';

interface Request {
  headers: Record<string, string>;
}

const checkAuth = (req: Request, enforce = false) => {
  if (!enforce) {
    return;
  }
  if (!req.headers.authorization || req.headers.authorization !== `Bearer ${ACCESS_TOKEN}`) {
    throw Error(`Authentication failed. Auth header: ${req.headers.authorization}`);
  }
};

export const mockCreateApplication = (scope: nock.Scope, ups: UPSEngineMock, enforceAuth = false) => {
  return scope.post(REST_APPLICATIONS_ENDPOINT).reply(200, function (uri: string, requestBody: nock.Body) {
    checkAuth(this.req, enforceAuth);
    return ups.createApplication(requestBody as PushApplication);
  });
};

export const mockUpdateApplication = (scope: nock.Scope, ups: UPSEngineMock, enforceAuth = false) => {
  return scope.put(/rest\/applications\/([^/]+)$/).reply(function (uri: string, requestBody: nock.Body) {
    checkAuth(this.req, enforceAuth);
    const urlWithParam = /rest\/applications\/([^/]+)$/;
    const urlParams = urlWithParam.exec(uri)!;
    const appId = urlParams[1];

    const update = requestBody as PushApplication;
    const app = ups.getApplications(appId);
    if (!app) {
      return [404];
    }

    ups.updateApplication(appId, update);

    return [204];
  });
};

export const mockGetApplications = (scope: nock.Scope, ups: UPSEngineMock, enforceAuth = false) => {
  // get all applications
  scope = scope.get(/rest\/applications\?/).reply(function (uri: string) {
    // uri/?parameterName=value&parameterName2=value&page=...
    if (uri.includes('page')) {
      const parsed = new URL(uri, 'http://localhost:8888');
      const apps = ups.getApplications(undefined, (parsed.searchParams.get('page') as unknown) as number);
      return [200, apps, {total: ups.countApplications()}];
    }

    checkAuth(this.req, enforceAuth);
    return [200, ups.getApplications(), {total: ups.countApplications()}];
  });

  // get application by id

  scope = scope.get(/rest\/applications\/([^/]+)\?/).reply(function (uri: string) {
    checkAuth(this.req, enforceAuth);
    const urlWithParam = /rest\/applications\/([^/]+)\?/;
    const urlParams = urlWithParam.exec(uri)!;
    const appId = urlParams[1];
    return [200, ups.getApplications(appId), {total: ups.countApplications()}];
  });

  scope = scope.get(/rest\/applications\/([^/]+)$/).reply(function (uri: string) {
    checkAuth(this.req, enforceAuth);
    const urlWithParam = /rest\/applications\/([^/]+)$/;
    const urlParams = urlWithParam.exec(uri)!;
    const appId = urlParams[1];
    return [200, ups.getApplications(appId), {total: ups.countApplications()}];
  });

  return scope;
};

export const mockDeleteApplication = (scope: nock.Scope, ups: UPSEngineMock, enforceAuth = false) => {
  return scope.delete(/rest\/applications\/([^/]+)$/).reply(function (uri: string) {
    checkAuth(this.req, enforceAuth);
    const urlWithParam = /rest\/applications\/([^/]+)$/;
    const urlParams = urlWithParam.exec(uri)!;
    const appId = urlParams[1];

    const app = ups.getApplications(appId);
    if (!app) {
      return [404, `Application with id ${appId} not found`];
    }

    ups.deleteApplication(appId);
    return [204];
  });
};
