import {AbstractVariantCommand} from './AbstractVariantCommand';
import {Variant, VariantType} from './Variant';
import {ApiClient} from '../ApiClient';

export class RenewSecretCommand extends AbstractVariantCommand<Variant> {
  private readonly variantType: VariantType;
  private readonly variantId: string;

  constructor(api: ApiClient, appId: string, variantType: VariantType, variantId: string) {
    super(api, appId);
    this.variantId = variantId;
    this.variantType = variantType;
  }

  protected async exec(): Promise<Variant> {
    return (await this.api.put(`/applications/${this.appId}/${this.variantType}/${this.variantId}/reset`))
      .data as Variant;
  }
}
