import { PushApplication } from '../../src/applications';
import * as nock from 'nock';
import { mockData } from './mockData';
import { AndroidVariant } from '../../src/variants';

export const BASE_URL = 'http://localhost:9999';

export const NEW_APP_NAME = 'Test Application 1';
export const NEW_APP: PushApplication = {
  name: NEW_APP_NAME,
  pushApplicationID: '1222423',
  id: '12123',
  developer: 'test',
  description: 'desc',
  variants: [],
  masterSecret: 'Shhhhhhh!',
};

// KC AUTH
export const KEYCLOAK_URL = 'http://localhost:8080';
export const KC_CREDENTIALS = {
  username: 'TESTADM',
  password: 'TESTADMPWD',
  realm: 'TESTREALM',
  client_id: 'TEST_CL_ID',
};
const ACCESS_TOKEN = 'AAAAABBBBSSSHHHH_TEST_AAHAHHSJDJDHHSA';

export const TEST_NEW_VARIANT_CREATED = {
  name: 'TestAndroid',
  variantID: '123VARIANT456',
  googleKey: '123GOOGLE456',
  projectNumber: '123PRJ456',
  secret: 'Shhhhh!!',
  developer: 'TESTDEV',
  description: 'Test variant',
  id: '123IDVARIANT456ID',
  type: 'android',
} as AndroidVariant;

export const TEST_NEW_VARIANT_TO_CREATE = {
  name: 'TestAndroid',
  googleKey: '123GOOGLE456',
  projectNumber: '123PRJ456',
  type: 'android',
} as AndroidVariant;

const REST_APPLICATIONS_ENDPOINT = '/rest/applications';

interface Request {
  headers: Record<string, string>;
}

const checkAuth = (req: Request, enforce: boolean) => {
  if (!enforce) {
    return;
  }
  if (!req.headers.authorization || req.headers.authorization !== `Bearer ${ACCESS_TOKEN}`) {
    throw Error(`Authentication failed. Auth header: ${req.headers.authorization}`);
  }
};

export const mockUps = (baseUrl = BASE_URL, auth = false) =>
  nock(baseUrl)
    .get(/rest\/applications\/?[^\/]*\/?[^\/]*$/)
    // tslint:disable-next-line:only-arrow-functions
    .reply(200, function(uri, requestBody) {
      checkAuth(this.req, auth);
      // extracting appID
      const urlWithParam = /rest\/applications\/?([^\/]*)\/?([^\/]*)$$/;
      const urlParams = urlWithParam.exec(uri)!;

      const appId = urlParams[1];
      const variantType = urlParams[2];

      if (appId.length > 0) {
        const app = mockData.find(app => app.pushApplicationID === appId);

        if (!app) {
          throw Error(`Unknown app with id '${appId}'`);
        }

        if (variantType.length > 0) {
          return app.variants ? app.variants.filter(variant => variant.type === variantType) : [];
        }

        return app;
      } else {
        return mockData;
      }
    })
    .post(REST_APPLICATIONS_ENDPOINT, { name: NEW_APP_NAME })
    // tslint:disable-next-line:only-arrow-functions
    .reply(function(uri, requestBody) {
      checkAuth(this.req, auth);

      return [200, NEW_APP];
    })
    .post('/rest/applications/2:2/android')
    .reply(200, function(uri, requestBody) {
      checkAuth(this.req, auth);
      expect(requestBody).toEqual(TEST_NEW_VARIANT_TO_CREATE);
      return TEST_NEW_VARIANT_CREATED;
    })
    .post('/rest/applications/2:2/ios')
    .reply(200, function(uri, requestBody) {
      //expect(requestBody).toEqual(TEST_NEW_VARIANT_TO_CREATE);
      //console.log({requestBody});
      checkAuth(this.req, auth);
      expect(requestBody.indexOf('name="name"')).not.toEqual(-1);
      expect(requestBody.indexOf('name="production"')).not.toEqual(-1);
      expect(requestBody.indexOf('name="passphrase"')).not.toEqual(-1);
      expect(requestBody.indexOf('name="certificate"')).not.toEqual(-1);
      return TEST_NEW_VARIANT_CREATED;
    })
    .persist(true);

export const mockKeyCloak = () =>
  nock(KEYCLOAK_URL)
    .post(
      `/auth/realms/${KC_CREDENTIALS.realm}/protocol/openid-connect/token`,
      `grant_type=password&client_id=${KC_CREDENTIALS.client_id}&username=${KC_CREDENTIALS.username}&password=${KC_CREDENTIALS.password}`
    )
    // tslint:disable-next-line:only-arrow-functions
    .reply(200, { access_token: ACCESS_TOKEN })
    .persist(true);
