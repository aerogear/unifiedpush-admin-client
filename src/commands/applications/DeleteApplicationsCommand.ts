import {AbstractFilteredApplicationsCommand} from './AbstractFilteredApplicationsCommand';
import {SearchApplicationsCommand} from './SearchApplicationsCommand';
import {PushApplication} from './PushApplication';

export class DeleteApplicationsCommand extends AbstractFilteredApplicationsCommand<
  PushApplication[],
  DeleteApplicationsCommand
> {
  protected async exec(): Promise<PushApplication[]> {
    const deletePromises = (
      await new SearchApplicationsCommand(this.api).withFilter(this.filter).page(-1).execute()
    ).list.map(
      async application =>
        await this.api.delete(`/applications/${application.pushApplicationID}`).then(() => application)
    );

    if (deletePromises.length < 1) {
      return [];
    }

    return Promise.all<PushApplication>(deletePromises);
  }
}
