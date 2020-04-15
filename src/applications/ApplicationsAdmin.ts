import { AxiosInstance, AxiosResponse } from 'axios';
import { applyPushApplicationFilter, PushApplication, PushApplicationSearchOptions } from './PushApplication';

export class ApplicationsAdmin {
  // tslint:disable-next-line:no-any
  ensureIsArray(obj: any) {
    if (obj instanceof Array) {
      return obj;
    }
    return [obj];
  }

  async find(api: AxiosInstance, filter?: PushApplicationSearchOptions): Promise<PushApplication[]> {
    let url = `/applications`;
    let response: AxiosResponse;

    if (filter && filter.pushApplicationID) {
      url = `${url}/${filter.pushApplicationID}`;

      response = await api.get(url, {
        params: {
          includeDeviceCount: filter?.includeDeviceCount === true,
          includeActivity: filter?.includeActivity === true,
        },
      });
    } else {
      response = await api.get(url, {
        params: {
          includeDeviceCount: filter?.includeDeviceCount === true,
          includeActivity: filter?.includeActivity === true,
        },
      });
    }
    let apps: PushApplication[] = applyPushApplicationFilter(this.ensureIsArray(response.data), filter);

    // Add deviceCount info and activityInfo to the PushApplication object
    if (filter?.includeDeviceCount || filter?.includeActivity) {
      // Add info to the app
      apps = apps.map((app: PushApplication) => {
        app.activity = response.headers[`activity_app_${app.pushApplicationID?.toLowerCase()}`];
        app.deviceCount = response.headers[`devicecount_app_${app.pushApplicationID?.toLowerCase()}`];

        // Add info to the variant
        app.variants = app.variants?.map(variant => {
          variant.activity = response.headers[`activity_variant_${app.pushApplicationID?.toLowerCase()}`];
          variant.deviceCount = response.headers[`devicecount_variant_${app.pushApplicationID?.toLowerCase()}`];
          return variant;
        });

        return app;
      });
    }
    return apps;
  }

  async create(api: AxiosInstance, name: string): Promise<PushApplication> {
    return (await api.post(`/applications`, { name })).data;
  }
}
