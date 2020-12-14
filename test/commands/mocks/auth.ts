import * as nock from 'nock';
import {TEST_AUTH_CONFIG, TEST_UI_CONFIG} from './constants';

export class AuthMock {
  private readonly basePath;
  constructor(basePath: string) {
    this.basePath = basePath;
    this.setupGetAuthConfigMock();
    this.setupGetUiConfigMock();
  }

  private readonly setupGetAuthConfigMock = () => {
    nock(`${this.basePath}`)
      .get('/rest/auth/config')
      .reply(() => {
        return [200, TEST_AUTH_CONFIG];
      })
      .persist();
  };

  private readonly setupGetUiConfigMock = () => {
    nock(`${this.basePath}`)
      .get('/rest/ui/config')
      .reply(() => {
        return [200, TEST_UI_CONFIG];
      })
      .persist();
  };
}
