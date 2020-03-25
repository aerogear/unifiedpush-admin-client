import { Variant } from './Variant';

/**
 * Interface containing all the fields that can be used to filter applications
 */
export interface PushApplicationFilter {
  id?: string;
  name?: string;
  description?: string;
  pushApplicationID?: string;
  developer?: string;
}

export interface PushApplication extends PushApplicationFilter {
  name: string;
  developer: string;
  masterSecret?: string;
  variants?: Variant[];
}

/**
 * Applies a filter to a list of PushApplications
 * @param apps the list to be filtered
 * @param filter the filter to be applied
 */
export const applyPushApplicationFilter = (apps: PushApplication[], filter: PushApplicationFilter): PushApplication[] => {
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
