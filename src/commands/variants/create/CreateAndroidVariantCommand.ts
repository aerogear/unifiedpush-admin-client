import {AndroidVariant, AndroidVariantDefinition} from '../AndroidVariant';
import {AbstractCreateVariantCommand} from './AbstractCreateVariantCommand';
import {ApiClient} from '../../ApiClient';

export class CreateAndroidVariantCommand extends AbstractCreateVariantCommand<
  AndroidVariantDefinition,
  AndroidVariant,
  CreateAndroidVariantCommand
> {
  constructor(api: ApiClient, appId: string) {
    super(api, appId, 'android');
    this.def.type = 'android';
  }

  readonly withGoogleKey = (googleKey: string): CreateAndroidVariantCommand => {
    this.def.googleKey = googleKey;
    return this;
  };

  readonly withProjectNumber = (projectNumber: string): CreateAndroidVariantCommand => {
    this.def.projectNumber = projectNumber;
    return this;
  };
}
