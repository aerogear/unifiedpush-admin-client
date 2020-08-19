import {AbstractFilteredApplicationsCommand} from './AbstractFilteredApplicationsCommand';
import {SearchApplicationsCommand} from './SearchApplicationsCommand';
import {PushApplication} from './PushApplication';
import {NotFoundError} from '../../errors/NotFoundError';
import {UpsErrorDetails} from '../../errors/UpsError';

export class DeleteApplicationsCommand extends AbstractFilteredApplicationsCommand<
  PushApplication[],
  DeleteApplicationsCommand
> {
  protected async exec(): Promise<PushApplication[]> {
    const deletePromises = (await new SearchApplicationsCommand(this.api).withFilter(this.filter).execute()).list.map(
      async application =>
        await this.api.delete(`/applications/${application.pushApplicationID}`).then(() => application)
    );

    if (deletePromises.length < 1) {
      throw new NotFoundError("Can't find requested application", this.filter as UpsErrorDetails);
    }

    return Promise.all<PushApplication>(deletePromises);
  }
}
