import { UnifiedPushAdminClient } from './UnifiedPushAdminClient';

async function run() {
  // const app = await new UPSClient().applications.create(newApp);
  // console.log('NewApp: ', app);

  // const apps = await new UnifiedPushClient().applications.find({
  //   name: 'New Ziccardi',
  // });
  // console.log('apps', apps);

  //B868CC08-BCC8-4A0A-B21E-1AC56AF0C734
  // const variants = await new UnifiedPushClient('http://localhost:9999', {
  //   kcUrl: 'http://172.18.0.2:8080',
  //   username: 'admin',
  //   password: '123',
  // }).variants.find('58939fc1-8868-46f5-95e3-0637ea97f9f4');

  const variants = await new UnifiedPushAdminClient('http://localhost:9999', {
    kcUrl: 'http://172.18.0.2:8080',
    username: 'admin',
    password: '123',
    type: 'keycloak',
  }).variants.find('58939fc1-8868-46f5-95e3-0637ea97f9f4');
  console.log('variants', variants);
}

run().catch(err => console.log('err', err));
