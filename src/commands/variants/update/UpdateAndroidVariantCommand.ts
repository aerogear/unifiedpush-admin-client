import {AbstractUpdateVariantCommand} from './AbstractUpdateVariantCommand';
import {AndroidVariantDefinition} from '../AndroidVariant';
import {ApiClient} from '../../ApiClient';

export class UpdateAndroidVariantCommand extends AbstractUpdateVariantCommand<
  UpdateAndroidVariantCommand,
  AndroidVariantDefinition
> {
  constructor(api: ApiClient, appId: string, variantId: string) {
    super(api, appId, variantId, 'android');
  }

  readonly withGoogleKey = (googleKey: string): UpdateAndroidVariantCommand => {
    this.def.googleKey = googleKey;
    return this;
  };

  readonly withProjectNumber = (projectNumber: string): UpdateAndroidVariantCommand => {
    this.def.projectNumber = projectNumber;
    return this;
  };
}
