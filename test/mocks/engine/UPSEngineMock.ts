import {PushApplication} from '../../../src/applications';
import {Guid} from 'guid-typescript';
import {Variant} from '../../../src/variants';

export class UPSEngineMock {
  private data: PushApplication[] = [];

  createApplication(newAppDef: PushApplication) {
    const newApp: PushApplication = {...(newAppDef as {})} as PushApplication;

    newApp.masterSecret = Guid.raw();
    newApp.pushApplicationID = newApp.pushApplicationID || Guid.raw();
    newApp.id = Guid.raw();
    newApp.developer = newApp.developer || 'admin';
    this.data.push(newApp);
    return newApp;
  }

  getApplications(id?: string, page = 1, itemPerPage = 10) {
    if (!id) {
      const firstIndex = itemPerPage * (page - 1);
      const endIndex = firstIndex + itemPerPage;

      return this.data.slice(firstIndex, endIndex);
    } else {
      return this.data.find(item => item.pushApplicationID === id);
    }
  }

  deleteApplication(id: string) {
    this.data = this.data.filter(item => item.pushApplicationID !== id);
  }

  // Variants
  createVariant(appId: string, variantDef: Variant) {
    const newVariant: Variant = {...(variantDef as {})} as Variant;
    newVariant.variantID = newVariant.variantID || Guid.raw();
    newVariant.developer = newVariant.developer || 'admin';
    newVariant.secret = Guid.raw();
    newVariant.id = Guid.raw();

    const app = this.data.find(item => item.pushApplicationID === appId)!;
    app.variants = app.variants || [];
    app.variants.push(newVariant);

    return newVariant;
  }

  getVariants(appId: string, type: string) {
    const app = this.getApplications(appId) as PushApplication;
    if (!app) {
      return null;
    }

    return app.variants ? app.variants.filter(variant => variant.type === type) : [];
  }

  deleteVariant(appId: string, type: string, variantId: string) {
    const app = this.getApplications(appId) as PushApplication;
    if (!app) {
      return null;
    }

    const variant =
      app.variants && app.variants.find(variant => variant.type === type && variant.variantID === variantId);
    if (variant) {
      app.variants = app.variants?.filter(variant => variant.type !== type && variant.variantID !== variantId);
    }
    return variant;
  }

  reset = () => (this.data = []);
}
