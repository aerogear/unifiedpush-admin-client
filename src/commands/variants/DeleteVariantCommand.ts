import {AbstractFilteredVariantsCommand} from './AbstractFilteredVariantsCommand';
import {SearchVariantsCommand} from './SearchVariantsCommand';
import {Variant} from './Variant';

export class DeleteVariantCommand extends AbstractFilteredVariantsCommand<Variant[], DeleteVariantCommand> {
  protected async exec(): Promise<Variant[]> {
    return Promise.all(
      (await new SearchVariantsCommand(this.api, this.appId).withFilter(this.filter).execute()).map(variant =>
        this.api.delete(`/applications/${this.appId}/${variant.type}/${variant.variantID!}`).then(() => variant)
      )
    );
  }
}
