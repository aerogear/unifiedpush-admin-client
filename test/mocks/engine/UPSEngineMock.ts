import {Guid} from 'guid-typescript';
import {PushApplication} from '../../../src/commands/applications';
import {Variant} from '../../../src/commands/variants/Variant';

export class UPSEngineMock {
  private data: PushApplication[] = [];

  createApplication(newAppDef: PushApplication): PushApplication {
    const newApp: PushApplication = {...(newAppDef as {})} as PushApplication;

    // newApp.masterSecret = Guid.raw();
    newApp.pushApplicationID = newApp.pushApplicationID || Guid.raw();
    // newApp.id = Guid.raw();
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
  getApplications(id?: string, page = 0, itemPerPage = 10): PushApplication[] | PushApplication | undefined {
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

  deleteApplication(id: string): void {
    this.data = this.data.filter(item => item.pushApplicationID !== id);
  }

  updateApplication(appId: string, update: PushApplication): void {
    const app = this.data.find(item => item.pushApplicationID === appId);
    if (app) {
      app.name = update.name || app.name;
      app.description = update.description || app.description;
    }
  }

  // Variants
  createVariant(appId: string, variantDef: Variant): Variant {
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

  getVariants(appId: string, type: string): Variant[] | null {
    const app = this.getApplications(appId) as PushApplication;
    if (!app) {
      return null;
    }

    return app.variants ? app.variants.filter(variant => variant.type === type) : [];
  }

  updateVariant(appId: string, variantId: string, variantType: string, variant: Variant): Variant | null {
    const app = this.data.find(app => app.pushApplicationID === appId);
    if (!app) {
      return null;
    }

    let variantToUpdate = app.variants?.find(v => v.variantID === variantId && v.type === variantType);
    if (!variantToUpdate) {
      return null;
    }

    variantToUpdate = {
      ...variantToUpdate,
      ...variant,
    };

    app.variants = app.variants?.map(variant =>
      variant.variantID === variantToUpdate?.variantID ? variantToUpdate : variant
    );

    return variantToUpdate;
  }

  deleteVariant(appId: string, type: string, variantId: string): Variant | undefined | null {
    const app = this.getApplications(appId) as PushApplication;
    if (!app) {
      return null;
    }

    const variant = app.variants && app.variants.find(v => v.type === type && v.variantID === variantId);
    if (variant) {
      app.variants = app.variants?.filter(v => v.type !== type && v.variantID !== variantId);
    }
    return variant;
  }

  renewVariantSecret(appId: string, variantType: string, variantId: string): Variant | undefined {
    const variant = this.getVariants(appId, variantType)?.find(variant => variant.variantID === variantId);

    if (variant) {
      variant.secret = Guid.raw();
    }

    return variant;
  }

  countApplications = (): number => this.data.length;

  reset = (): PushApplication[] => (this.data = []);
}
