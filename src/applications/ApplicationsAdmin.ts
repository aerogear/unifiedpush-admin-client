import {AxiosInstance, AxiosResponse} from 'axios';
import {applyPushApplicationFilter, PushApplication, PushApplicationSearchOptions} from './PushApplication';

export class ApplicationsAdmin {
  readonly DEFAULT_PAGE_SIZE = 10;

  async find(
    api: AxiosInstance,
    {
      filter,
      page = 0,
      pageSize = this.DEFAULT_PAGE_SIZE,
    }: {filter?: PushApplicationSearchOptions; page?: number; pageSize?: number} = {}
  ): Promise<PushApplication[]> {
    let url = '/applications';
    let apps: PushApplication[];

    const ensureIsArray = (obj: any) => (obj instanceof Array ? obj : [obj]);

    // Reads the activity from the headers and adds it to the app metadata
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

    // Recursive function that gets all the application from all pages
    const getAllApplications = async (
      currentResult: PushApplication[] = [],
      currentPage = 0
    ): Promise<PushApplication[]> => {
      const response = await api.get(url, {
        params: {
          includeDeviceCount: filter?.includeDeviceCount === true,
          includeActivity: filter?.includeActivity === true,
          page: currentPage,
        },
      });
      const appList = ensureIsArray(response.data);
      if (appList.length > 0) {
        return await getAllApplications(applyPushApplicationFilter([...currentResult, ...appList]), currentPage + 1);
      }
      return currentResult;
    };

    // Extract a single page from all the received applications
    const getPage = (appList: PushApplication[], desiredPage = 0, desiredPageSize = this.DEFAULT_PAGE_SIZE) => {
      const firstIndex = desiredPageSize * desiredPage;
      const endIndex = firstIndex + desiredPageSize;

      return appList.slice(firstIndex, endIndex);
    };

    if (filter) {
      if (filter.pushApplicationID) {
        // If we have the pushApplicationID, we can get that app straight away: we don't need to filter.
        url = `${url}/${filter.pushApplicationID}`;

        const response = await api.get(url, {
          params: {
            includeDeviceCount: filter?.includeDeviceCount === true,
            includeActivity: filter?.includeActivity === true,
          },
        });
        apps = ensureIsArray(response.data).map((app: PushApplication) => addActivityData(app, response));
      } else {
        // To filter on other fields than `id` we need to get ALL the applications from UPS
        apps = getPage(applyPushApplicationFilter(await getAllApplications(), filter), page);
      }
    } else {
      // there is no filter, we can ask the page to the UPS
      const response = await api.get(url, {
        params: {
          includeDeviceCount: true,
          includeActivity: true,
          page,
        },
      });
      apps = ensureIsArray(response.data).map((app: PushApplication) => addActivityData(app, response));
    }

    // filter the result
    return apps;
  }

  async create(api: AxiosInstance, name: string): Promise<PushApplication> {
    return (await api.post('/applications', {name})).data;
  }

  async update(api: AxiosInstance, pushApplication: PushApplication) {
    await api.put(`/applications/${pushApplication.pushApplicationID}`, pushApplication);
  }
  //new delete function
  async delete(api: AxiosInstance, filter?: PushApplicationSearchOptions) {
    return Promise.all(
      (await this.find(api, {filter})).map(application =>
        api.delete(`/applications/${application.pushApplicationID}`).then(() => application)
      )
    );
  }
}
