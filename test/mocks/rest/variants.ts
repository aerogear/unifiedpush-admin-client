import * as nock from 'nock';
import {UPSEngineMock} from '../engine/UPSEngineMock';
import {Variant} from '../../../src/commands/variants/Variant';

export const mockGetVariants = (scope: nock.Scope, ups: UPSEngineMock) => {
  return scope.get(/rest\/applications\/([^/]+)\/([^/]+)$/).reply((uri: string) => {
    const regex = /rest\/applications\/([^/]+)\/([^/]+)$/;
    const urlParams = regex.exec(uri)!;
    const appId = urlParams[1];
    const variantType = urlParams[2];

    const app = ups.getApplications(appId);
    if (!app) {
      return [404, `App with id '${appId}' not found`];
    }

    return [200, ups.getVariants(appId, variantType)];
  });
};

export const mockCreateVariant = (scope: nock.Scope, ups: UPSEngineMock) => {
  return scope.post(/rest\/applications\/([^/]+)\/([^/]+)$/).reply((uri: string, requestBody: nock.Body) => {
    const regex = /rest\/applications\/([^/]+)\/([^/]+)$/;
    const urlParams = regex.exec(uri)!;
    const appId = urlParams[1];

    const app = ups.getApplications(appId);
    if (!app) {
      return [404, `App with id '${appId}' not found`];
    }

    return [201, ups.createVariant(appId, requestBody as Variant)];
  });
};

export const mockDeleteVariant = (scope: nock.Scope, ups: UPSEngineMock) => {
  return scope.delete(/rest\/applications\/([^/]+)\/([^/]+)\/([^/]+)$/).reply((uri: string) => {
    const regex = /rest\/applications\/([^/]+)\/([^/]+)\/([^/]+)$/;
    const urlParams = regex.exec(uri)!;
    const appId = urlParams[1];
    const variantType = urlParams[2];
    const variantId = urlParams[3];

    const variant = ups.deleteVariant(appId, variantType, variantId);
    if (!variant) {
      return [404, `Variant with id '${appId}' and type '${variantType} for app with id '${appId}' not found`];
    }

    return [202];
  });
};

export const mockRenewVariantSecret = (scope: nock.Scope, ups: UPSEngineMock) => {
  return scope.put(/rest\/applications\/([^/]+)\/([^/]+)\/([^/]+)\/reset$/).reply((uri: string) => {
    const regex = /rest\/applications\/([^/]+)\/([^/]+)\/([^/]+)\/reset$/;
    const urlParams = regex.exec(uri)!;
    const appId = urlParams[1];
    const variantType = urlParams[2];
    const variantId = urlParams[3];

    const variant = ups.renewVariantSecret(appId, variantType, variantId);
    if (!variant) {
      return [404, 'Could not find requested Variant'];
    }

    return [200, variant];
  });
};

export const mockUpdateVariant = (scope: nock.Scope, ups: UPSEngineMock) => {
  return scope.put(/rest\/applications\/([^/]+)\/([^/]+)\/([^/]+)$/).reply((uri: string, requestBody: nock.Body) => {
    const regex = /rest\/applications\/([^/]+)\/([^/]+)\/([^/]+)$/;
    const urlParams = regex.exec(uri)!;
    const appId = urlParams[1];
    const variantType = urlParams[2];
    const variantID = urlParams[3];

    const variant = ups.updateVariant(appId, variantID, variantType, requestBody as Variant);
    if (!variant) {
      return [404, 'Could not find requested Variant'];
    }

    return [204];
  });
};
