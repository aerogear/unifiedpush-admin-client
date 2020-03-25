export { PushApplication, PushApplicationFilter } from './PushApplication';
export { Variant, VariantFilter, VARIANT_TYPE } from './Variant';
export { AndroidVariant } from './variants/AndroidVariant';
export { IOSVariant, IOSTokenVariant } from './variants/IOSVariant';
export { UnifiedPushClient } from './UnifiedPushClient';

// const SUPPORTED_VARIANTS = ['android', 'ios', 'ios_token', 'web_push'];
// export type VARIANT_TYPE = 'android' | 'ios' | 'ios_token' | 'web_push';
//
//
//
// const newApp: PushApplication = {
//   name: 'New Ziccardi',
//   description: 'Test Zic App',
//   developer: 'aaa',
// };
//
// async function run() {
//   const app = await new UPSClient().applications.create(newApp);
//   console.log('NewApp: ', app);
//
//   const apps = await new UPSClient().applications.find({
//     name: 'New Ziccardi',
//   });
//   console.log('apps', apps);
// }
//
// run().catch(err => console.log(err.message));
