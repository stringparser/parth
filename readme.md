# parth [![build][badge-build]][x-travis][![NPM version][badge-version]][x-npm]

[documentation](#documentation) -
[examples](#examples) -
[install](#install) -
[todo](#todo) -
[why](#why)

## sample

```js
var parth = new require('parth')();
```

_add_

```js
parth.add(':method(get|post) /:page/:view')
{
  /^(get|post) \/([^/ ]+)\/([^/ ]+)/i
  path: ':method(get|post) /:page/:view',
  depth: 3,
  def: 2,
  cus: 1
}
```
_match_

```js
var extra = { };
parth.match('post /user/page/?query=name&path=tree#hash', extra)
{
  /^(get|post) \/([^/ ]+)\/([^/ ]+)/i
  path: ':method(get|post) /:page/:view',
  depth: 3,
  def: 2,
  cus: 1
}

console.log(extra);
{
  path: 'post /user/page/photo',
  url: '/user/page/photo?query=name&path=tree#hash',
  notFound: '/photo',
  match: 'post /user/page',
  params: {
    _: [ 'method', 'page', 'view' ],
    method: 'post',
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

### parth.add(path[, opt])

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
    - def: number of default regexes used for set
    - cus: number of custom regexes parsed for set
    - depth: type `number`, integer representing the `depth` of the path

`path` can contain any number of parameters(regexes) in the form
```js
 :param-label(\\regexp(?:here))
```
Any string matching the regular expression below qualifies as a parameter

````js
/(^|\W)\:([^(?#/.: ]+)(\([^)]*?\)+)?/g;
````

[Go to http://regexr.com/](http://regexr.com/3akrq) and test it out.

> Characters should be escaped i.e. `\\w+`

### parth.match(path[, opt])

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

> All matches partial i.e. /^regex baby/i.
> Not being strict is useful for `notFound` paths

### parth properties

 - `regex`: an array of carefully ordered regexes
 - `regex.master`: regex aggregating what was learned
 - `store.children`: all paths added for match are here

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

 - [ ] add support for regexp input

### license

![LICENSE](http://img.shields.io/npm/l/parth.svg?style=flat-square)

[x-npm]: https://npmjs.org/package/parth
[x-travis]: https://travis-ci.org/stringparser/parth/builds
[badge-build]: http://img.shields.io/travis/stringparser/parth/master.svg?style=flat-square
[badge-version]: http://img.shields.io/npm/v/parth.svg?style=flat-square
