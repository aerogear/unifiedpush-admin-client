import {AbstractCommand} from '../AbstractCommand';
import {ApiClient} from '../ApiClient';
import {Variant} from '../variants/Variant';

export interface Result {
  total: number;
  list: FlatPushMessageInformation[];
}

export interface FlatPushMessageInformation {
  pushApplicationId: string;
  rawJsonMessage: string;
  ipAddress?: string;
  clientIdentifier?: string;
  submitDate?: Date;
  appOpenCounter?: number;
  firstOpenDate?: Date;
  lastOpenDate?: Date;
  errors?: Array<VariantErrorStatus>;
}

export interface VariantErrorStatus {
  pushMessageVariantId?: string; // = "push-job-id" + ":" + "variant-id";
  errorReason?: string; // the text we receive for the error

  pushJobId?: string;
  variantID?: string;

  variant: Variant;
}

export class LoadMetricsCommand extends AbstractCommand<Result> {
  protected readonly appId: string;

  constructor(api: ApiClient, appId: string) {
    super(api);
    this.appId = appId;
  }

  private pageSize = 10;
  private pageNumber = 0;

  readonly withPageSize = (pageSize: number): LoadMetricsCommand => {
    this.pageSize = pageSize;
    return this;
  };

  readonly withPage = (pageNumber: number): LoadMetricsCommand => {
    this.pageNumber = pageNumber;
    return this;
  };

  protected async exec(): Promise<Result> {
    const result = await this.api.get(`/metrics/messages/application/${this.appId}`, {
      params: {
        page: this.pageNumber,
        per_page: this.pageSize,
        sort: 'desc',
        search: '',
      },
    });

    const list = result.data as FlatPushMessageInformation[];

    return {
      total: result.headers['total'],
      list: list,
    } as Result;
  }
}
