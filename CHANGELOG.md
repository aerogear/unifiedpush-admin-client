# [1.0.0](https://github.com/aerogear/unifiedpush-admin-client/compare/0.1.10...1.0.0) (2020-05-18)


* feat(applist)!: added pagination ([166d185](https://github.com/aerogear/unifiedpush-admin-client/commit/166d185e50e8efab56cf7ac04f55a253ce71c14a))


### BREAKING CHANGES

* now the list function takes a different set of parameters: instead of just the `filter` it now takes an object with keys `filter` and `page`. The syntax for
filter is the same as before, while the page is just a number representing the page number to be returned



## [0.1.10](https://github.com/aerogear/unifiedpush-admin-client/compare/0.1.9...0.1.10) (2020-05-18)



## [0.1.9](https://github.com/aerogear/unifiedpush-admin-client/compare/0.1.8...0.1.9) (2020-05-06)


### Bug Fixes

* the application delete method was not exposed into the UnifiedPushAdminClient class ([746b7e6](https://github.com/aerogear/unifiedpush-admin-client/commit/746b7e69840ddb9539c434d3a4fce46e1257fe9d))



