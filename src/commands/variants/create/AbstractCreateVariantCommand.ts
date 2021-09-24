import {AbstractVariantCommand} from '../AbstractVariantCommand';
import {Variant, VariantDefinition, VariantType} from '../Variant';
import {ApiClient} from '../../ApiClient';

export abstract class AbstractCreateVariantCommand<
  T extends VariantDefinition,
  K extends Variant,
  Z extends AbstractCreateVariantCommand<T, K, Z>
> extends AbstractVariantCommand<K> {
  protected def: T = {} as T;
  private type: VariantType;

  constructor(api: ApiClient, appId: string, type: VariantType) {
    super(api, appId);
    this.type = type;
  }

  readonly withName = (name: string): Z => {
    this.def.name = name;
    return this as unknown as Z;
  };

  readonly withDeveloper = (developer: string): Z => {
    this.def.developer = developer;
    return this as unknown as Z;
  };

  readonly withSecret = (secret: string): Z => {
    this.def.secret = secret;
    return this as unknown as Z;
  };

  readonly withDescription = (description: string): Z => {
    this.def.description = description;
    return this as unknown as Z;
  };

  readonly withDefinition = (def: T): Z => {
    this.def = {
      ...this.def,
      ...def,
    };
    return this as unknown as Z;
  };

  protected readonly exec = async (): Promise<K> => {
    return (await this.api.post(`/applications/${this.appId}/${this.type}`, this.def)).data as K;
  };
}
