import * as nock from 'nock';

export const KEYCLOAK_URL = 'http://localhost:8080';
export const KC_CREDENTIALS = {
  username: 'TESTADM',
  password: 'TESTADMPWD',
  realm: 'TESTREALM',
  client_id: 'TEST_CL_ID',
};

export const ACCESS_TOKEN = 'AAAAABBBBSSSHHHH_TEST_AAHAHHSJDJDHHSA';

export const mockKeyCloak = (): nock.Scope =>
  nock(KEYCLOAK_URL)
    .post(
      `/auth/realms/${KC_CREDENTIALS.realm}/protocol/openid-connect/token`,
      `grant_type=password&client_id=${KC_CREDENTIALS.client_id}&username=${KC_CREDENTIALS.username}&password=${KC_CREDENTIALS.password}`
    )
    // tslint:disable-next-line:only-arrow-functions
    .reply(200, {access_token: ACCESS_TOKEN})
    .persist(true);
