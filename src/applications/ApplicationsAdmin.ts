import { AxiosInstance } from 'axios';
import { applyPushApplicationFilter, PushApplication, PushApplicationSearchOptions } from './PushApplication';

export class ApplicationsAdmin {
  async find(api: AxiosInstance, filter?: PushApplicationSearchOptions): Promise<PushApplication[]> {
    let url = `/applications`;
    if (filter && filter.pushApplicationID) {
      url = `${url}/${filter.pushApplicationID}`;

      const response = await api.get(url, {
        params: {
          includeDeviceCount: filter?.includeDeviceCount === true,
          includeActivity: filter?.includeActivity === true,
        },
      });

      let res: PushApplication[] = response.data instanceof Array ? response.data : [response.data];

      // Add deviceCount info and activityInfo to the PushApplication object
      if (filter?.includeDeviceCount || filter?.includeActivity) {
        // Add info to the app
        res = res.map(app => {
          app.activity = response.headers[`activity_app_${app.pushApplicationID}`];
          app.deviceCount = response.headers[`deviceCount_app_${app.pushApplicationID}`];

          // Add info to the variant
          app.variants = app.variants?.map(variant => {
            variant.activity = response.headers[`activity_variant_${app.pushApplicationID}`];
            variant.deviceCount = response.headers[`deviceCount_variant_${app.pushApplicationID}`];
            return variant;
          });

          return app;
        });
      }

      return res;
    } else {
      return applyPushApplicationFilter((await api.get(url)).data, filter);
    }
  }

  async create(api: AxiosInstance, name: string): Promise<PushApplication> {
    return (await api.post(`/applications`, { name })).data;
  }
}
