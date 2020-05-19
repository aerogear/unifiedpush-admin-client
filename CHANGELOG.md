## [2.0.4](https://github.com/aerogear/unifiedpush-admin-client/compare/2.0.3...2.0.4) (2020-05-19)



## [2.0.3](https://github.com/aerogear/unifiedpush-admin-client/compare/2.0.2...2.0.3) (2020-05-19)



## [2.0.2](https://github.com/aerogear/unifiedpush-admin-client/compare/2.0.1...2.0.2) (2020-05-19)



## [2.0.1](https://github.com/aerogear/unifiedpush-admin-client/compare/2.0.0...2.0.1) (2020-05-19)



# [2.0.0](https://github.com/aerogear/unifiedpush-admin-client/compare/1.0.0...2.0.0) (2020-05-19)


### Bug Fixes

* **applications:** filtering now works beyond first page ([dc49c66](https://github.com/aerogear/unifiedpush-admin-client/commit/dc49c66d3fc5c45069f43de4388725644bfde13e))


* feat(applist)!: added pagination ([1284e8e](https://github.com/aerogear/unifiedpush-admin-client/commit/1284e8ec9421c4faf52bded158fe22a3f928cf55))


### BREAKING CHANGES

* now the list function takes a different set of parameters: instead of just the `filter` it now takes an object with keys `filter` and `page`. The syntax for
filter is the same as before, while the page is just a number representing the page number to be returned



