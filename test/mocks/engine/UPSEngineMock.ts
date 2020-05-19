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

  /**
   * Gets a list of applications
   * @param id the id of the application. Optional
   * @param page the page. Starts with 0.
   * @param itemPerPage
   */
  getApplications(id?: string, page = 0, itemPerPage = 10) {
    let apps: PushApplication[] | PushApplication | undefined;
    if (!id) {
      const firstIndex = itemPerPage * page;
      const endIndex = firstIndex + itemPerPage;

      apps = this.data.slice(firstIndex, endIndex);
    } else {
      apps = this.data.find(item => item.pushApplicationID === id);
    }
    return apps || [];
  }

  deleteApplication(id: string) {
    this.data = this.data.filter(item => item.pushApplicationID !== id);
  }

  updateApplication(update: PushApplication) {
    const app = this.data.find(item => item.pushApplicationID === update.pushApplicationID);
    if (app) {
      app.name = update.name || app.name;
      app.description = update.description || app.description;
    }
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

  countApplications = () => this.data.length;

  reset = () => (this.data = []);
}
