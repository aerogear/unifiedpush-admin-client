import * as nock from 'nock';
import {UPSEngineMock} from '../engine/UPSEngineMock';

import {mockCreateApplication, mockDeleteApplication, mockGetApplications, mockUpdateApplication} from './applications';
import {
  mockCreateAndroidVariant,
  mockCreateiOSVariant,
  mockDeleteVariant,
  mockGetVariants,
  mockRenewVariantSecret,
  mockUpdateVariant,
} from './variants';
import {mockKeyCloak} from './keycloak';

const BASE_URL = 'http://localhost:8888';

export class UPSMock {
  private mock = nock(BASE_URL);
  private readonly ups = new UPSEngineMock();
  private enforceAuth = false;

  constructor(enforceAuth = false) {
    this.enforceAuth = enforceAuth;
    this.ups = new UPSEngineMock();
    this.mock = nock(BASE_URL);

    // Applications
    this.mock = this.mockCreateApplication();
    this.mock = this.mockGetApplications();
    this.mockDeleteApplication();
    this.mockUpdateApplication();

    // Variants
    this.mockCreateAndroidVariant();
    this.mockCreateiOSVariant();
    this.mockGetVariants();
    this.mockDeleteVariant();
    this.mockUpdateVariant();
    this.mockRenewVariantSecret();

    this.mock.persist(true);

    mockKeyCloak().persist(true);
  }

  private mockCreateApplication = () => (this.mock = mockCreateApplication(this.mock, this.ups, this.enforceAuth));
  private mockUpdateApplication = () => (this.mock = mockUpdateApplication(this.mock, this.ups, this.enforceAuth));
  private mockGetApplications = () => (this.mock = mockGetApplications(this.mock, this.ups, this.enforceAuth));
  private mockDeleteApplication = () => (this.mock = mockDeleteApplication(this.mock, this.ups, this.enforceAuth));

  // Variants management

  private mockGetVariants = () => (this.mock = mockGetVariants(this.mock, this.ups));
  private mockCreateAndroidVariant = () => (this.mock = mockCreateAndroidVariant(this.mock, this.ups));
  private mockCreateiOSVariant = () => (this.mock = mockCreateiOSVariant(this.mock, this.ups));
  private mockDeleteVariant = () => (this.mock = mockDeleteVariant(this.mock, this.ups));
  private mockUpdateVariant = () => (this.mock = mockUpdateVariant(this.mock, this.ups));
  private mockRenewVariantSecret = () => (this.mock = mockRenewVariantSecret(this.mock, this.ups));

  // State management
  reset = () => this.ups.reset();
  uninstall = () => nock.restore();
  getImpl = () => this.ups;
}
