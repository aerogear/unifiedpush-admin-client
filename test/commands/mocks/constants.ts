import {Result} from '../../../src/commands/metrics/LoadMetricsCommand';

export const UPS_URL = 'http://localhost:8888';
export const VARIANTS = ['android', 'ios', 'ios_token', 'web_push'];
export const TEST_AUTH_CONFIG = {
  url: 'http://localhost:9999',
};

export const TEST_UI_CONFIG = {
  variants: ['android', 'ios'],
};

export const TEST_METRICS: Result = {
  total: 3,
  list: [
    {
      pushApplicationId: '2194723947239847',
      rawJsonMessage: "{ msg: 'test'}",
      ipAddress: '127.0.0.1',
      clientIdentifier: 'test identifier',
    },
  ],
};
