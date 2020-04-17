import {Variant} from '../variants/Variant';

interface SharedPushAppAtts {
  id?: string;
  name?: string;
  description?: string;
  pushApplicationID?: string;
  developer?: string;
}

/**
 * Interface containing all the fields that can be used to filter applications
 */
export interface PushApplicationSearchOptions extends SharedPushAppAtts {
  includeDeviceCount?: boolean;
  includeActivity?: boolean;
}

export interface PushApplication extends PushApplicationSearchOptions {
  name: string;
  developer: string;
  masterSecret?: string;
  variants?: Variant[];
  deviceCount?: number;
  activity?: number;
}

/**
 * Applies a filter to a list of PushApplications
 * @param apps the list to be filtered
 * @param filter the filter to be applied
 */
export const applyPushApplicationFilter = (
  apps: PushApplication[],
  filter?: PushApplicationSearchOptions
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
