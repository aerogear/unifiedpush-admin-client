import {IOSTokenVariantDefinition, UpsAdminClient} from '../../../../src';
import {createApplications, getAllApplications, initMockEngine} from '../../mocks/UPSMock';
import {UPS_URL} from '../../mocks/constants';

beforeEach(() => {
  initMockEngine(UPS_URL);
});

describe('CreateIOSTokenCommand', () => {
  const BASE_URL = 'http://localhost:8888';

  const upsAdminClient = new UpsAdminClient(BASE_URL);

  it('Should create an ios token variant', async () => {
    createApplications({});
    const appId = getAllApplications()[7].pushApplicationID;

    const appName = 'TestIOSTokenNAME';
    const teamID = '12345';
    const privateKey = 'PRIVATE KEY';
    const keyID = 'KEY-ID';
    const bundleID = 'BUNDLE-ID';

    let variant = await upsAdminClient.variants.ios_token
      .create(appId)
      .withName(appName)
      .withTeamID(teamID)
      .withPrivateKey(privateKey)
      .withKeyID(keyID)
      .withBundleID(bundleID)
      .isDevelopment()
      .execute();
    expect(variant.name).toBe(appName);
    expect(variant.teamId).toBe(teamID);
    expect(variant.privateKey).toBe(privateKey);
    expect(variant.keyId).toBe(keyID);
    expect(variant.bundleId).toBe(bundleID);
    expect(variant.production).toBe(false);

    variant = await upsAdminClient.variants.ios_token
      .create(appId)
      .withName(appName)
      .withTeamID(teamID)
      .withPrivateKey(privateKey)
      .withKeyID(keyID)
      .withBundleID(bundleID)
      .isProduction()
      .execute();
    expect(variant.name).toBe(appName);
    expect(variant.teamId).toBe(teamID);
    expect(variant.privateKey).toBe(privateKey);
    expect(variant.keyId).toBe(keyID);
    expect(variant.bundleId).toBe(bundleID);
    expect(variant.production).toBe(true);
  });

  it('Should create an ios token using a definition', async () => {
    createApplications({});
    const appId = getAllApplications()[7].pushApplicationID;

    const appName = 'TestIOSTokenNAME';
    const teamID = '12345';
    const privateKey = 'PRIVATE KEY';
    const keyID = 'KEY-ID';
    const bundleID = 'BUNDLE-ID';

    const variant = await upsAdminClient.variants.ios_token
      .create(appId)
      .withDefinition({
        name: appName,
        teamId: teamID,
        privateKey,
        keyId: keyID,
        bundleId: bundleID,
        production: true,
      } as IOSTokenVariantDefinition)
      .execute();
    expect(variant.name).toBe(appName);
    expect(variant.teamId).toBe(teamID);
    expect(variant.privateKey).toBe(privateKey);
    expect(variant.keyId).toBe(keyID);
    expect(variant.bundleId).toBe(bundleID);
    expect(variant.production).toBe(true);
  });
});
