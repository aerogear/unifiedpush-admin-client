# UnifiedPush Server Admin Client

![Build](https://github.com/aerogear/unifiedpush-admin-client/workflows/build/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/aerogear/unifiedpush-admin-client/badge.svg?branch=master)](https://coveralls.io/github/aerogear/unifiedpush-admin-client)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/af0c8d43f45a418a8844b68969b7efd2)](https://www.codacy.com/gh/aerogear/unifiedpush-admin-client?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=aerogear/unifiedpush-admin-client&amp;utm_campaign=Badge_Grade)

The _UnifiedPush Server Admin_ library allows to admin the UPS by javascript or typescript code.

Supported features are:

**Applications**
* **create**: allows to create an application initialised with all the provided properties
* **delete**: allows to delete all the applications matching given criteria
* **update**: allows to update a given application
* **search**: allows to search for all the applications matching given criteria

**Variants**
* **create**: allows to create a variant initialised with all the specified properties
* **delete**: allows to delete all the variants matching given criteria
* **update**: allows to update a given variant
* **search**: allows to search for all the variants matching given criteria
* **renew secret**: allows to renew the secret of a given variant

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

The entry point of the library is the _UpsAdminClient_ class. Its constructor takes two arguments:
1. **serverURL**: The URL of the _UnifiedPushServer_. The url must be complete of protocol and port.  
   Example:  
   `http://localhost:9999` 
2. **credentials**: This parameter is be used to authenticate before trying to call the UPS REST endpoints. Two types of credentials
can be specified:
   * Basic: this is just username/password used for basic authentication
   * Keycloak: this is composed of **username/password**, **realm**, **client_id** and **keycloak URL**. Optionally, if you already have a valid bearer token, it
   can be specified here, so that the library won't try to authenticate again.
   
**Example without credentials:** 
```typescript
const upsadm = new UpsAdminClient('http://localhosrt:9999');
```

**Example with basic authentication:**  
```typescript
const upsadm = new UpsAdminClient('http://localhosrt:9999', 
        {username: 'username', password: 'password', type: 'basic'});
```

**Example with keycloak authentication:**
```typescript
const upsadm = new UpsAdminClient('http://localhosrt:9999', 
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
const searchResult = await upsadm.applications.search().execute();
console.log(`Total number of applications: ${searchResult.total}`);
console.log('Applications:', searchResult.list)
```

The search provides a _fluid interface_ that allows to filter the results.
For example, to search all the applications named 'TEST' we can do:

```typescript
const searchResult = await upsadm.applications.search()
    .withName('TEST')
    .execute();
```

More than one filter can be specified.

**WARNING** The result is returned one page at a time. Each page will contain 10 applications. To specify which page to return, the 
`page` parameter must be specified:

```typescript
const searchResult = await upsadm.applications.search()
    .withName('TEST')
    .page(3)
    .execute();
```
The returned value will be a dictionary containing the following keys:
* **total**: the total number of apps that match the given filter
* **list**: the current result page

To create an application we will use the `create` method:
```typescript
const app = await upsadm.applications.create('newApp').execute();
```
The returned `app` object will have all the `id` and `pushApplicationId` fields populated by the server.

To update an application we will use the `update` method:

```typescript
const apps = await upsadm.applications.update(appId)
    .withName('newName')
    .execute();
```  

#### Managing variants

All the methods to be used to manage variants can be found inside the `variants` namespace.
To get the list of the variants, we will use
```typescript
const apps = await upsadm.variants.search(appId).execute();
```
where `appId` is the id of the application owning the variants.

The search command provides a fluent interface that can be used to add filters to the search:
```typescript
const apps = await upsadm.variants.search(appId)
    .withName('my variant')
    .execute();
```
**NOTE** You are not limited to use only one filter: if you specify more than one, they will be all applied. The only 
exception is the `id` filter: if specified, all the other filters will be ignored.

To create a variant we will use the `create` method:
```typescript
const variant = upsadm.variants.android.
    create(appId)
    .withName('MyNewVariant')
    .withGoogleKey('googleKey')
    .withProjectNumber('12345')
    .execute();
```
The returned `variant` object will have all the `pushApplicationID` field populated by the server.

To delete variants, we will use the `delete` method:

```typescript
const apps = upsadm.variants.delete(appId).execute();
```

If you don't want to delete all the variants, you can decide what to delete by using the fluent interface:

```typescript
const apps = upsadm.variants.delete(appId)
    .withName('apptodelete')
    .execute();
```

If you want to work on variants of a specified type, you can use the scoped version of the delete method:

```typescript
const apps = upsadm.variants.android.delete(appId)
    .withName('apptodelete')
    .execute();
```
