import {AxiosInstance, AxiosResponse} from 'axios';
import {applyPushApplicationFilter, PushApplication, PushApplicationSearchOptions} from './PushApplication';

export interface SearchResults {
  total: number;
  appList: PushApplication[];
}

export class ApplicationsAdmin {
  readonly DEFAULT_PAGE_SIZE = 10;

  async find(
    api: AxiosInstance,
    {
      filter,
      page = 0,
      pageSize = this.DEFAULT_PAGE_SIZE,
    }: {filter?: PushApplicationSearchOptions; page?: number; pageSize?: number} = {}
  ): Promise<SearchResults> {
    let url = '/applications';

    let result: SearchResults = {
      appList: [],
      total: 0,
    };

    //////////////////////////////////////////////////////////////////////
    // Reads the activity from the headers and adds it to the app metadata
    //////////////////////////////////////////////////////////////////////
    const addActivityData = (app: PushApplication, response: AxiosResponse) => {
      if (filter?.includeDeviceCount || filter?.includeActivity) {
        app.activity = response.headers[`activity_app_${app.pushApplicationID?.toLowerCase()}`];
        app.deviceCount = response.headers[`devicecount_app_${app.pushApplicationID?.toLowerCase()}`];

        // Add info to the variant
        app.variants = app.variants?.map(variant => {
          variant.activity = response.headers[`activity_variant_${app.pushApplicationID?.toLowerCase()}`];
          variant.deviceCount = response.headers[`devicecount_variant_${app.pushApplicationID?.toLowerCase()}`];
          return variant;
        });
      }
      return app;
    };

    if (filter) {
      if (filter.pushApplicationID) {
        // If we have the pushApplicationID, we can get that app straight away: we don't need to filter.
        url = `${url}/${filter.pushApplicationID}`;

        const response = await api.get(url, {
          params: {
            includeDeviceCount: filter?.includeDeviceCount === true,
            includeActivity: filter?.includeActivity === true,
            per_page: pageSize,
          },
        });

        const apps = utils.ensureIsArray(response.data).map((app: PushApplication) => addActivityData(app, response));

        result = {
          appList: apps,
          total: apps.length,
        };
      } else {
        // To filter on other fields than `id` we need to get ALL the applications from UPS
        const appList = applyPushApplicationFilter(await utils.getAllApplications(api), filter);

        result = {
          total: appList.length,
          appList,
        };
        result.appList = utils.getPage(result.appList, page, pageSize);
      }
    } else {
      // there is no filter, we can ask the page to the UPS
      const response = await api.get(url, {
        params: {
          includeDeviceCount: true,
          includeActivity: true,
          page,
          per_page: pageSize,
        },
      });

      result.total = parseInt(response.headers['total']);
      result.appList = utils.ensureIsArray(response.data).map((app: PushApplication) => addActivityData(app, response));
    }

    return result;
  }

  async create(api: AxiosInstance, name: string): Promise<PushApplication> {
    return (await api.post('/applications', {name})).data;
  }

  async update(api: AxiosInstance, pushApplication: PushApplication) {
    await api.put(`/applications/${pushApplication.pushApplicationID}`, pushApplication);
  }
  async delete(api: AxiosInstance, filter?: PushApplicationSearchOptions) {
    return Promise.all(
      (await this.find(api, {filter})).appList.map(application =>
        api.delete(`/applications/${application.pushApplicationID}`).then(() => application)
      )
    );
  }
}

const utils = {
  ensureIsArray: (obj: unknown) => (obj instanceof Array ? obj : [obj]),
  getPage: (appList: PushApplication[], page: number, pageSize: number) => {
    const firstIndex = pageSize * page;
    const endIndex = firstIndex + pageSize;

    return appList.slice(firstIndex, endIndex);
  },
  getAllApplications: async (
    api: AxiosInstance,
    filter?: PushApplicationSearchOptions,
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
    const appList = utils.ensureIsArray(response.data);
    if (appList.length > 0) {
      return await utils.getAllApplications(
        api,
        filter,
        applyPushApplicationFilter([...currentResult, ...appList]),
        startWithPage + 1
      );
    }
    return currentResult;
  },
};
