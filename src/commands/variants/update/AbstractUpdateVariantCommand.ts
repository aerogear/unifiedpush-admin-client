import {AbstractVariantCommand} from '../AbstractVariantCommand';
import {VariantDefinition, VariantType} from '../Variant';
import {ApiClient} from '../../ApiClient';

export abstract class AbstractUpdateVariantCommand<
  T extends AbstractVariantCommand<void>,
  K extends VariantDefinition
> extends AbstractVariantCommand<void> {
  protected readonly variantId: string;
  protected def: VariantDefinition = {};
  private type: VariantType;

  constructor(api: ApiClient, appId: string, variantId: string, variantType: VariantType) {
    super(api, appId);
    this.variantId = variantId;
    this.type = variantType;
  }

  readonly withName = (name: string): T => {
    this.def.name = name;
    return (this as unknown) as T;
  };

  readonly withDescription = (description: string): T => {
    this.def.description = description;
    return (this as unknown) as T;
  };

  readonly withDeveloper = (developer: string): T => {
    this.def.developer = developer;
    return (this as unknown) as T;
  };

  readonly withVariantDefinition = (def: K): T => {
    this.def = {
      ...this.def,
      ...def,
    };
    return (this as unknown) as T;
  };

  protected readonly exec = async (): Promise<void> => {
    await this.api.put(`/applications/${this.appId}/${this.type}/${this.variantId}`, this.def);
  };
}
