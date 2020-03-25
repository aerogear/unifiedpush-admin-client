import { UnifiedPushClient } from './UnifiedPushClient';
// const newApp: PushApplication = {
//   name: 'New Ziccardi',
//   description: 'Test Zic App',
//   developer: 'aaa',
// };
//
async function run() {
  // const app = await new UPSClient().applications.create(newApp);
  // console.log('NewApp: ', app);

  // const apps = await new UnifiedPushClient().applications.find({
  //   name: 'New Ziccardi',
  // });
  // console.log('apps', apps);

  //B868CC08-BCC8-4A0A-B21E-1AC56AF0C734
  const variants = await new UnifiedPushClient('http://localhost:9999').variants.find('B868CC08-BCC8-4A0A-B21E-1AC56AF0C734', { type: 'android' });
  console.log('variants', variants);
}

run().catch(err => console.log(err.message));
