# parth [![NPM version][badge-version]][x-npm] [![downloads][badge-downloads]][x-npm]

[documentation](#documentation) -
[examples](#examples) -
[install](#install) -
[todo](#todo) -
[why](#why)

[![build][badge-build]][x-travis]

## sample

```js
var parth = new require('parth')();
```

_set_

```js
parth.set('(get|post) /:page(\\w+)/:view([^./]+)')
{
  /^(get|post) \/(\w+)\/([^.\/]+)/
  path: '(get|post) /:page(\\w+)/:view([^.\\/]+)',
  stem: ':0(get|post) /:page(\\w+)/:view([^.\\/]+)',
  depth: 3
}
```
_get_

```js
var extra = { };
parth.get('post /user/page/photo?query=name&path=tree#hash', extra)
{
  /^(get|post) \/(\w+)\/([^.\/]+)/
  path: '(get|post) /:page(\\w+)/:view([^.\\/]+)',
  stem: ':0(get|post) /:page(\\w+)/:view([^.\\/]+)',
  depth: 3
}

console.log(extra);
{
  notFound: '/photo',
  path: 'post /user/page/photo',
  url: '/user/page/photo?query=name&path=tree#hash',
  match: 'post /user/page',
  params: {
    '0': 'post',
    _: [ '0', 'page', 'view' ],
    page: 'user',
    view: 'page'
  }
}
```

## documentation

The `module.exports` a `Parth` constructor

````js
var Parth = require('parth');
````

which takes no arguments
```js
var parth = new Parth();
```

### parth.set(path[, opt])

Create a regular expression from a string and store it for later look up.

_arguments_
- `path` type `string`
- `opt` type `object` optional, with extra info after function call:
  - path: the `path` given as an input
  - url: type `string`. If any, the url contained within the given `path`

_return_
  - `null` for non-supported types
  - `regex` object with properties below
    - path: the input path sanitized
    - depth: type `number`, integer representing the `depth` of the path

`path` can contain any number of parameters(regexes) in the form
```js
 :param-label(\\regexp(?:here))
```
Any string matching the regular expression below qualifies as a parameter

````js
/([ /.=]?):([\w-]+)(\(.+?(?:\)\??)+)?/g;
````

[Go to http://regexr.com/](http://regexr.com/3be8b) and test it out.

> Characters should be escaped i.e. `\\w+`

### parth.get(path[, opt])

Obtain a regex that matches the given path.

_arguments_
- `path` type `string`
- `opt` type `object` optional, with extra info after function call:
  - path: the `path` given as an input
  - url: if any, the url contained within the `path` given
  - match: type `string`, part of the path that matched
  - notFound: `false` for perfect match, what is left after of the path if the match wasn't perfect
  - params: object map from labels to the given path. Label keys at `_`.

_return_
  - `null` for no matches or non-supported types
  - `regex` object matching the path given, with same properties of #set

> All matches partial i.e. /^regex baby/.
> Not being strict is useful for `notFound` paths

### parth properties

 - `store`: all paths set for match are here
 - `regex`: array of carefully ordered regexes
 - `regex.master`: regex aggregating with all learned

## why

I need it for the [runtime](https://github.com/stringparser/runtime) module.

## install

With [npm](http://npmjs.org)

    npm install --save parth

### examples

Run the [`example.js`](example.js) file.

### test

    npm test

```
➜  parth (master) ✓ npm t
parth
  paths
    ✓ object
    ✓ raw object paths
    ✓ unix paths
    ✓ raw unix paths
    ✓ urls
    ✓ raw urls
    ✓ urls: querystring is stripped
    ✓ urls: hash is stripped
    ✓ urls: parameters are not mistaken as querystrings
    ✓ space separated paths
    ✓ raw, space separated paths
    ✓ unix, object and url paths together
    ✓ raw: unix, object and urls paths together
  params
    ✓ can be given as a string regex
    ✓ will contain all parameter keys at _
    ✓ parameter values should be at params
  notFound
    ✓ should be false for perfect match
    ✓ should have what is left of the path


18 passing (16ms)
```

### todo

 - [ ] set support for regexp input

### license

![LICENSE](http://img.shields.io/npm/l/parth.svg?style=flat-square)

[x-npm]: https://npmjs.org/package/parth
[x-travis]: https://travis-ci.org/stringparser/parth/builds
[badge-build]: http://img.shields.io/travis/stringparser/parth/master.svg?style=flat-square
[badge-version]: http://img.shields.io/npm/v/parth.svg?style=flat-square
[badge-downloads]: http://img.shields.io/npm/dm/parth.svg?style=flat-square
