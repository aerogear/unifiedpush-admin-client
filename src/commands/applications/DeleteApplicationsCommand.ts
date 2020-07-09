import {AbstractFilteredApplicationsCommand} from './AbstractFilteredApplicationsCommand';
import {SearchApplicationsCommand} from './SearchApplicationsCommand';
import {PushApplication} from './PushApplication';

export class DeleteApplicationsCommand extends AbstractFilteredApplicationsCommand<
  PushApplication[],
  DeleteApplicationsCommand
> {
  protected async exec(): Promise<PushApplication[]> {
    return Promise.all(
      (await new SearchApplicationsCommand(this.api).withFilter(this.filter).execute()).list.map(application =>
        this.api.delete(`/applications/${application.pushApplicationID}`).then(() => application)
      )
    );
  }
}
