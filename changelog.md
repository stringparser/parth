# Changelog

### 2.6.0 - Support paths without parameter labels ([5ddea6d](http://github.com/stringparser/parth/commit/5ddea6d))
Added noParamRE to find groups without parameter labels. Regexes does not have to be stored with children data; use localeCompare for situations where the number of def and cust is the same.

- add example for path without params ([96b601a](http://github.com/stringparser/parth/commit/96b601a))
- add test for groups without params ([e6fdb4e](http://github.com/stringparser/parth/commit/e6fdb4e))
- bump: return raw regex ([62aba18](http://github.com/stringparser/parth/commit/62aba18))
- return the regex ([036a469](http://github.com/stringparser/parth/commit/036a469))
- bug with extras ([a114871](http://github.com/stringparser/parth/commit/a114871))
- bump ([f2374fb](http://github.com/stringparser/parth/commit/f2374fb))
- minor improvements ([82cc50d](http://github.com/stringparser/parth/commit/82cc50d))
- give url only to parth.match ([5fac925](http://github.com/stringparser/parth/commit/5fac925))
- improvements ([f7377fb](http://github.com/stringparser/parth/commit/f7377fb))
  - add a escape regex property in case raw paths were tried to be matched 
  - make the regex non enumerable property for the store so is not copied by accident and maybe ruin everything
  - return early on parth.match if no options were given
- use iojs-v1.5.0 for tests ([e1e0350](http://github.com/stringparser/parth/commit/e1e0350))
