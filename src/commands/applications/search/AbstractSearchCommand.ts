import {AxiosResponse} from 'axios';
import {PushApplication, PushApplicationFilter} from '../PushApplication';
import {ApiClient} from '../../ApiClient';

export interface SearchResult {
  total: number;
  list: PushApplication[];
}

export abstract class AbstractSearchCommand {
  protected readonly addActivityData = (app: PushApplication, response: AxiosResponse): PushApplication => {
    app.metadata = {
      activity: +response.headers[`activity_app_${app.pushApplicationID.toLowerCase()}`],
      deviceCount: +response.headers[`devicecount_app_${app.pushApplicationID?.toLowerCase()}`],
    };

    // Add info to the variant
    app.variants = app.variants?.map(variant => {
      variant.metadata = {
        activity: +response.headers[`activity_variant_${variant.variantID?.toLowerCase()}`],
        deviceCount: +response.headers[`devicecount_variant_${variant.variantID?.toLowerCase()}`],
      };
      return variant;
    });
    return app;
  };

  protected readonly getPage = (appList: PushApplication[], page: number, pageSize: number): PushApplication[] => {
    const firstIndex = pageSize * page;
    const endIndex = firstIndex + pageSize;

    return appList.slice(firstIndex, endIndex);
  };

  protected readonly ensureIsArray = <T>(obj: T | Array<T>): Array<T> => (obj instanceof Array ? obj : [obj]);

  protected readonly applyPushApplicationFilter = (
    apps: PushApplication[],
    filter?: PushApplicationFilter
  ): PushApplication[] => {
    if (filter) {
      return apps.filter(
        app =>
          (!filter.name || filter.name === app.name) &&
          (!filter.description || filter.description === app.description) &&
          (!filter.pushApplicationID || filter.pushApplicationID === app.pushApplicationID) &&
          (!filter.developer || filter.developer === app.developer)
      );
    }
    return apps;
  };

  protected readonly getAllApplications = async (
    api: ApiClient,
    filter?: {[key: string]: unknown},
    currentResult: PushApplication[] = [],
    startWithPage = 0
  ): Promise<PushApplication[]> => {
    const url = '/applications';
    const response = await api.get(url, {
      params: {
        includeDeviceCount: filter?.includeDeviceCount === true,
        includeActivity: filter?.includeActivity === true,
        page: startWithPage,
        per_page: 100,
      },
    });
    const appList = this.ensureIsArray(response.data);
    if (appList.length > 0) {
      return await this.getAllApplications(
        api,
        filter,
        this.applyPushApplicationFilter([...currentResult, ...appList]),
        startWithPage + 1
      );
    }
    return currentResult;
  };

  abstract execute(api: ApiClient, page: number, pageSize: number): Promise<SearchResult>;
}
