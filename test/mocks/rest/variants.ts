import * as nock from 'nock';
import {IOSVariant, Variant} from '../../../src/variants';
import {UPSEngineMock} from '../engine/UPSEngineMock';

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

export const mockCreateAndroidVariant = (scope: nock.Scope, ups: UPSEngineMock) => {
  return scope.post(/rest\/applications\/([^/]+)\/android/).reply((uri: string, requestBody: nock.Body) => {
    const regex = /rest\/applications\/([^/]+)/;
    const urlParams = regex.exec(uri)!;
    const appId = urlParams[1];

    const app = ups.getApplications(appId);
    if (!app) {
      return [404, `App with id '${appId}' not found`];
    }

    return [201, ups.createVariant(appId, requestBody as Variant)];
  });
};

export const mockCreateiOSVariant = (scope: nock.Scope, ups: UPSEngineMock) => {
  return scope.post(/rest\/applications\/([^/]+)\/ios/).reply((uri: string, requestBody: nock.Body) => {
    const regex = /rest\/applications\/([^/]+)/;
    const urlParams = regex.exec(uri)!;
    const appId = urlParams[1];

    const app = ups.getApplications(appId);
    if (!app) {
      return [404, `App with id '${appId}' not found`];
    }

    // Extract data from the multipart form
    const lines = requestBody.split('\n');
    const formData: Record<string, string> = {};
    let fieldName = '';

    for (let i = 0; i < lines.length; i++) {
      if (
        lines[i].startsWith('----') ||
        lines[i].replace(/(\r\n|\n|\r)/gm, '').length === 0 ||
        lines[i].startsWith('Content-Type')
      ) {
        // skip
        continue;
      }

      if (lines[i].startsWith('Content-Disposition')) {
        // get field name
        fieldName = /.*name="(.*)".*/.exec(lines[i])![1];
        continue;
      }

      // If we reach this step, we found the value
      //console.log('Value: ', lines[i].replace(/(\r\n|\n|\r)/gm,""));
      formData[fieldName] = lines[i].replace(/(\r\n|\n|\r)/gm, '');
    }
    const variantDef = (formData as unknown) as IOSVariant;
    variantDef.type = 'ios';

    return [201, ups.createVariant(appId, variantDef)];
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
