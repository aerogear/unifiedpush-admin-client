# UnifiedPush Server Admin Client

![Build](https://github.com/aerogear/unifiedpush-admin-client/workflows/build/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/aerogear/unifiedpush-admin-client/badge.svg)](https://coveralls.io/github/aerogear/unifiedpush-admin-client)

The _UnifiedPush Server Admin_ library allows to admin the UPS by javascript or typescript code.

## Getting started
### Cloning the repository

```bash
git clone https://github.com/aerogear/unifiedpush-admin-client.git
cd unifiedpush-admin-client
```

#### Compiling the code

```bash
npm run compile
```

#### Running the tests

```bash
npm run test
```

### Using the library

The entry point of the library is the _UnifiedPushAdminClient_ class. Its constructor takes two arguments:
1. *serverURL*: The URL of the _UnifiedPushServer_. The url must be complete of protocol and port.  
   Example:  
   `http://localhost:9999` 
1. *credentials*: This parameter is be used to authenticate before trying to call the UPS REST endpoints. Two types of credentials
can be specified:
   1. Basic: this is just username/password used for basic authentication
   2. Keycloak: this is composed of **username/password**, **realm**, **client_id** and **keycloak URL**. Optionally, if you already have a valid bearer token, it
   can be specified here, so that the library won't try to authenticate again.
   
**Example without credentials:** 
```typescript
const upsadm = new UnifiedPushAdminClient('http://localhosrt:9999');
```

**Example with basic authentication:**  
```typescript
const upsadm = new UnifiedPushAdminClient('http://localhosrt:9999', 
        {username: 'username', password: 'password', type: 'basic'});
```

**Example with keycloak authentication:**
```typescript
const upsadm = new UnifiedPushAdminClient('http://localhosrt:9999', 
        {
          kcUrl: 'http://172.18.0.2:8080',
          username: 'username',
          password: 'password',
          type: 'keycloak',
        });
```

You will notice that we didn't specify values for `client_id` and `realm`: they will default to `unified-push-server-js` 
and `aerogear` accordingly.

#### Managing applications

All the methods to be used to manage applications can be found inside the `applications` namespace.
To get the list of the applications, we will use
```typescript
const apps = upsadm.applications.find()
```

optionally a filter parameter can be specified. Applications can be filtered by:
* **id**
* **name**
* **description**
* **pushApplicationID**
* **developer**

**NOTE** You are not limited to use only one key when filtering: if more than one is specified, they are all applied. The only 
exception is the `id` filter: if the `id` is specified, all the other filters are ignored.

To create an application we will use the `create` method:
```typescript
const app = upsadm.applications.create('newApp')
```
The returned `app` object will have all the `id` and `pushApplicationId` fields populated by the server.

#### Managing variants

All the methods to be used to manage variants can be found inside the `variants` namespace.
To get the list of the variants, we will use
```typescript
const apps = upsadm.variants.find(appId)
```
where `appId` is the id of the application owning the variants.

The find method takes as parameter the owner application id and, optionally, a filter parameter. Variants can be filtered by:
* **id**
* **name**
* **description**
* **variantID**
* **developer**
* **type**: this can be android, ios, ios_token or web_push.

**NOTE** You are not limited to use only one key when filtering: if more than one is specified, they are all applied. The only 
exception is the `id` filter: if the `id` is specified, all the other filters are ignored.

To create an variant we will use the `create` method:
```typescript
const newVariant: AndroidVariant = {
...
};
const variant = upsadm.variants.create(appId, newVariant)
```
The returned `variant` object will have all the `id` fields populated by the server.
