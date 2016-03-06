# parth [![NPM version][badge-version]][x-npm] [![downloads][badge-downloads]][x-npm]

[documentation](#documentation) -
[examples](#examples) -
[install](#install) -
[todo](#todo) -
[why](#why)

[![build][badge-build]][x-travis]

## sample

```js
var Parth = require('parth');

var parth = new Parth();
var props = {handle: function(){}};

parth.set('(get|post) /:page(\\w+)/:view([^./]+)', props)
     .get('post /user/page/photo?query#hash')
// =>
{
  handle: [Function],
  path: 'post /user/page/photo',
  stem: ':0(get|post) /:page(\\w+)/:view([^./]+)',
  regex: /^(get|post) \/(\w+)\/([^./]+)/,
  depth: 3,
  notFound: '/photo',
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

## parth.set

```js
function set(string path[, object options])
```
This method purpose is to sanitize the `path` given
and classify the resulting regular expression with those
previously stored.

_arguments_
 - `path`, type `string`, path to be set
 - `options`, type `object`, to merge with this path properties

_returns_ `this`

> NOTE: `options` is deep cloned beforehand to avoid mutation

`path` can contain any number of parameters(regexes) in the form
```js
 :param-label(\\regexp(?:here))
```
Any string matching the regular expression below qualifies as a parameter

````js
/:([-\w]+)(\([^\s]+?[)][?)]*)?/g;
````

[Go to http://regexr.com/](http://regexr.com/3cuqq) and test it out.

## parth.get
```js
function get(string path)
```

Take a string and return a clone of the store object properties

_arguments_
 - `path`, type `string` to match stored paths with

_return_
 - null for non-supported types or not matching paths
 - object with all the information stored in `parth.set`

> All matches are partial i.e. /^regex baby/.
> Not being strict is useful for `notFound` paths.

> NOTE: the returned object is a deep copy of the original `options`
> given in `parth.set` to avoid mutation

### parth properties

 - `store`: all paths set for match are here
 - `regex`: array of carefully ordered regexes
 - `regex.master`: regex aggregating all learned

## why

I need it for the [gulp-runtime](https://github.com/stringparser/gulp-runtime) module.

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
