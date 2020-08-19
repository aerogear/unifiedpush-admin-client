import {Guid} from 'guid-typescript';
import {UPSMock} from './rest/UPSMock';
import {AndroidVariantDefinition, IOSVariantDefinition} from '../../src';
import {Variant} from '../../src';

export const utils = {
  generateApps: (upsMock: UPSMock, count: number, customAttrs?: Record<string, string>[]): string[] => {
    const APP_NAME_PREFIX = 'TEST APPLICATION';

    const getAttr = (index: number, attName: string) => {
      if (customAttrs && customAttrs.length > index) {
        return customAttrs[index][attName];
      }

      return undefined;
    };

    const genName = (index: number) => {
      return `${APP_NAME_PREFIX} ${index}`;
    };

    const ids: string[] = [];

    for (let i = 0; i < count; i++) {
      const app = upsMock.getImpl().createApplication({
        name: `${getAttr(i, 'name') || genName(i)}`,
        developer: getAttr(i, 'developer') || 'admin',
        pushApplicationID: getAttr(i, 'pushApplicationID')!,
        masterSecret: Guid.raw(),
      });

      ids.push(app.pushApplicationID!);
    }

    return ids;
  },
  generateVariants: (
    upsMock: UPSMock,
    appId: string,
    count: number,
    customAttrs?: Record<string, string>[]
  ): Variant[] => {
    const VARIANT_NAME_PREFIX = 'TEST VARIANT';

    const variants = [];

    const genRandomVariantDef = () => {
      if (Math.round(Math.random() * 10) % 2 === 0) {
        // Android variant
        return {
          type: 'android',
          googleKey: '123456',
          projectNumber: '1234556',
        } as AndroidVariantDefinition;
      } else {
        // iOS variant
        return {
          type: 'ios',
          production: false,
          certificate: '123',
        } as IOSVariantDefinition;
      }
    };

    for (let i = 0; i < count; i++) {
      variants.push(
        upsMock.getImpl().createVariant(appId, {
          name: `${VARIANT_NAME_PREFIX} ${i}`,
          developer: 'admin',
          variantID: Guid.raw(),
          ...(customAttrs ? customAttrs[i] : genRandomVariantDef()),
        } as Variant)
      );
    }
    return variants;
  },
  generateIDs: (count: number): string[] => {
    const res: string[] = [];
    for (let i = 0; i < count; i++) {
      res.push(Guid.raw());
    }
    return res;
  },
};
