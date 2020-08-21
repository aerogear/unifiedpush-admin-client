import * as nock from 'nock';
import {UPSEngineMock} from '../engine/UPSEngineMock';

import {mockCreateApplication, mockDeleteApplication, mockGetApplications, mockUpdateApplication} from './applications';
import {
  mockCreateVariant,
  mockDeleteVariant,
  mockGetVariants,
  mockRenewVariantSecret,
  mockUpdateVariant,
} from './variants';
import {mockKeyCloak} from './keycloak';
import {PushApplication} from '../../../src/commands/applications';

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
    this.mockCreateVariant();
    this.mockGetVariants();
    this.mockDeleteVariant();
    this.mockUpdateVariant();
    this.mockRenewVariantSecret();

    this.mock.persist(true);

    mockKeyCloak().persist(true);
  }

  private mockCreateApplication = (): nock.Scope =>
    (this.mock = mockCreateApplication(this.mock, this.ups, this.enforceAuth));
  private mockUpdateApplication = (): nock.Scope =>
    (this.mock = mockUpdateApplication(this.mock, this.ups, this.enforceAuth));
  private mockGetApplications = (): nock.Scope =>
    (this.mock = mockGetApplications(this.mock, this.ups, this.enforceAuth));
  private mockDeleteApplication = (): nock.Scope =>
    (this.mock = mockDeleteApplication(this.mock, this.ups, this.enforceAuth));

  // Variants management

  private mockGetVariants = (): nock.Scope => (this.mock = mockGetVariants(this.mock, this.ups));
  private mockCreateVariant = (): nock.Scope => (this.mock = mockCreateVariant(this.mock, this.ups));
  private mockDeleteVariant = (): nock.Scope => (this.mock = mockDeleteVariant(this.mock, this.ups));
  private mockUpdateVariant = (): nock.Scope => (this.mock = mockUpdateVariant(this.mock, this.ups));
  private mockRenewVariantSecret = (): nock.Scope => (this.mock = mockRenewVariantSecret(this.mock, this.ups));

  // State management
  reset = (): PushApplication[] => this.ups.reset();
  uninstall = (): void => nock.restore();
  getImpl = (): UPSEngineMock => this.ups;
}
