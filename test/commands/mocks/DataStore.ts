import {Guid} from 'guid-typescript';
import {
  AndroidVariant,
  IOSTokenVariant,
  IOSVariant,
  PushApplication,
  PushApplicationDefinition,
  Variant,
  WebPushVariant,
} from '../../../src';
import {VariantDefinition} from '../../../src/commands/variants/Variant';

export class IDGenerator {
  static nextid?: string;

  static next = (): string => {
    if (IDGenerator.nextid) {
      const ret = IDGenerator.nextid;
      IDGenerator.nextid = undefined;
      return ret;
    }
    return Guid.create().toString();
  };

  static peek = (): string => {
    if (!IDGenerator.nextid) {
      IDGenerator.nextid = Guid.create().toString();
    }
    return IDGenerator.nextid;
  };
}

export class DataStore {
  private appList: PushApplication[] = [];

  public readonly reset = (): void => {
    this.appList = [];
  };
  public readonly getAllApps = (): PushApplication[] => this.appList;

  public readonly createApp = (
    name: string,
    appDef: PushApplicationDefinition = {},
    persist = false
  ): PushApplication => {
    const app = {
      pushApplicationID: IDGenerator.next(),
      masterSecret: Guid.create().toString(),
      developer: 'test developer',
      name,
      ...appDef,
    };

    if (persist) {
      this.appList.push(app);
    }
    return app;
  };

  public readonly createVariant = (appId: string, def: VariantDefinition): Variant => {
    const app = this.appList.find(app => app.pushApplicationID === appId)!;
    const name = def.name || `VAR-${Guid.create().toString()}`;
    let variant: Variant;
    switch (def.type) {
      case 'android':
        variant = {
          name,
          description: `Description of ${name}`,
          developer: `Developer of ${name}`,
          variantID: IDGenerator.next(),
          googleKey: Guid.create().toString(),
          projectNumber: Guid.create().toString(),
          secret: Guid.create().toString(),
          type: 'android',
          ...def,
        } as AndroidVariant;
        break;
      case 'ios':
        variant = {
          name,
          description: `Description of ${name}`,
          developer: `Developer of ${name}`,
          variantID: IDGenerator.next(),
          certificate: '/path/to/cert.p12',
          passphrase: 'password',
          production: false,
          secret: Guid.create().toString(),
          type: 'ios',
          ...def,
        } as IOSVariant;
        break;
      case 'ios_token':
        variant = {
          name,
          description: `Description of ${name}`,
          developer: `Developer of ${name}`,
          variantID: IDGenerator.next(),
          teamId: 'MyTeamID',
          keyId: 'MyKeyID',
          bundleId: 'org.aerogear',
          privateKey: '/path/to/key',
          production: false,
          secret: Guid.create().toString(),
          type: 'ios_token',
          ...def,
        } as IOSTokenVariant;
        break;
      case 'web_push':
        variant = {
          name,
          description: `Description of ${name}`,
          developer: `Developer of ${name}`,
          variantID: IDGenerator.next(),
          secret: Guid.create().toString(),
          alias: 'mailto:test@redhat.com',
          type: 'web_push',
          ...def,
        } as WebPushVariant;
    }

    if (!app.variants) {
      app.variants = [];
    }
    app.variants.push(variant!);

    return variant!;
  };

  setAppList(pushApplications: PushApplication[]): void {
    this.appList = pushApplications;
  }

  getApp(appId: string): PushApplication | undefined {
    return this.appList.find(app => app.pushApplicationID === appId);
  }

  deleteApplication(appId: string): void {
    this.appList = this.appList.filter(app => app.pushApplicationID !== appId);
  }
}
