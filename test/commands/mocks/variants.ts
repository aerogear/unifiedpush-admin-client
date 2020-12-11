import {DataStore} from './DataStore';
import * as nock from 'nock';
import {VARIANTS} from './constants';
import {PushApplication, Variant, VariantType} from '../../../src';
import {VariantDefinition} from '../../../src/commands/variants/Variant';
import {Guid} from 'guid-typescript';

export class VariantsMock {
  private readonly datastore;
  private readonly app: PushApplication;
  private readonly basePath: string;
  constructor(basePath: string, datastore: DataStore, app: PushApplication) {
    this.datastore = datastore;
    this.app = app;
    this.basePath = basePath;
    VARIANTS.forEach(varType => this.setUpCreateVariantMock(app.pushApplicationID, varType));
    VARIANTS.forEach(varType => this.setupGetVariantsMock(varType));
  }

  public readonly createVariant = (variantName: string, variantType: string, def: VariantDefinition = {}): Variant => {
    const variant = this.datastore.createVariant(this.app.pushApplicationID, {
      name: variantName,
      type: variantType as VariantType,
      ...def,
    });
    this.setupDeleteVariantMock(variant);
    this.setupGetVariantMock(variant.variantID, variantType);
    this.setupUpdateVariantMock(variant);
    this.setupResetSecretMock(variant);
    return variant;
  };

  private readonly setupGetVariantsMock = (variantType: string) => {
    nock(this.basePath)
      .get(`/rest/applications/${this.app.pushApplicationID}/${variantType}`)
      .reply(() => {
        const app = this.datastore.getApp(this.app.pushApplicationID);
        if (!app) {
          return [404];
        }

        return [204, app.variants || []];
      })
      .persist();
  };

  private readonly setupGetVariantMock = (id: string, variantType: string) => {
    nock(this.basePath)
      .get(`/rest/applications/${this.app.pushApplicationID}/${variantType}/${id}`)
      .reply(() => {
        const app = this.datastore.getApp(this.app.pushApplicationID);
        const variant = app?.variants?.find(vv => vv.variantID === id && vv.type === variantType);
        if (!app || !variant) {
          return [404];
        }

        return [204, variant];
      })
      .persist();
  };

  private readonly setupDeleteVariantMock = (v: Variant) => {
    nock(this.basePath)
      .delete(`/rest/applications/${this.app.pushApplicationID}/${v.type}/${v.variantID}`)
      .reply(() => {
        const app = this.datastore.getApp(this.app.pushApplicationID);
        const variant = app?.variants?.find(vv => vv.variantID === v.variantID && vv.type === v.type);
        if (!app || !variant) {
          return [404];
        }

        app.variants = app.variants!.filter(vv => vv.variantID !== v.variantID || vv.type !== v.type);
        return [204];
      })
      .persist();
  };

  private readonly setupUpdateVariantMock = (v: Variant) => {
    nock(this.basePath)
      .put(`/rest/applications/${this.app.pushApplicationID}/${v.type}/${v.variantID}`)
      .reply((url, body) => {
        const app = this.datastore.getApp(this.app.pushApplicationID);
        const variantIndex = app?.variants?.findIndex(vv => vv.variantID === v.variantID && vv.type === v.type);
        if (!app || !variantIndex || variantIndex === -1) {
          return [404];
        }
        app.variants![variantIndex] = {...app.variants![variantIndex], ...(body as VariantDefinition)};
        return [204];
      })
      .persist();
  };

  private readonly setupResetSecretMock = (v: Variant) => {
    nock(this.basePath)
      .put(`/rest/applications/${this.app.pushApplicationID}/${v.type}/${v.variantID}/reset`)
      .reply(() => {
        const app = this.datastore.getApp(this.app.pushApplicationID);
        const variantIndex = app?.variants?.findIndex(vv => vv.variantID === v.variantID && vv.type === v.type);
        if (!app || !variantIndex || variantIndex === -1) {
          return [404];
        }
        app.variants![variantIndex].secret = Guid.create().toString();
        return [204, app.variants![variantIndex]];
      })
      .persist();
  };

  private readonly setUpCreateVariantMock = (appId: string, variantType: string): void => {
    nock(this.basePath)
      .post(`/rest/applications/${appId}/${variantType}`)
      .reply((url, body) => {
        const def = body as VariantDefinition;
        if (!VARIANTS.find(t => t === variantType)) {
          return [400];
        }

        const app = this.datastore.getAllApps().find(pushApp => pushApp.pushApplicationID === appId);

        if (!app) {
          return [404];
        }

        const variant = this.datastore.createVariant(app.pushApplicationID, {
          type: variantType as VariantType,
          ...def,
        });
        app.variants = app.variants || [];
        app.variants.push(variant);
        return [200, variant];
      })
      .persist();
  };
}
