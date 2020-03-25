import { Variant } from './Variant';

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
