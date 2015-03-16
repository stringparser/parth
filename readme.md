# parth
[<img alt="build" src="http://img.shields.io/travis/stringparser/parth/master.svg?style=flat-square" align="left"/>](https://travis-ci.org/stringparser/parth/builds)
[<img alt="NPM version" src="http://img.shields.io/npm/v/parth.svg?style=flat-square" align="right"/>](http://www.npmjs.org/package/parth)
<p align="center">
  <a href="#documentation">documentation</a> -
  <a href="#examples">examples</a> -
  <a href="#install">install</a> -
  <a href="#todo">todo</a> -
  <a href="#why">why</a>
</p>

path to regexp madness not only for an url

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
  cus: 1, def: 2
}
```
_match_

```js
var extra = { };
parth.match('post /user/page/?query=name&path=tree#hash', extra)
{
  /^(get|post) \/([^/ ]+)\/([^/ ]+)/i
  path: ':method(get|post) /:page/:view',
  cus: 1, def: 2
}

console.log(extra);
{
  notFound: '/photo',
  path: 'post /user/page/photo',
  url: '/user/page/photo?query=name&path=tree#hash',
  depth: 3,
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

### parth.add(path)

Create a regular expression from a string. Store it for later look up.

_arguments_
- `path` type `string`

_return_
  - `null` for non-supported types
  - `regex` object with properties below
    - path: the input path sanitized
    - def: number of default regexes used for set
    - cus: number of custom regexes parsed for set

`path` can contain any number of parameters(regexes) in the form
```js
 :param-label(\\regexp(?:here))
```
Any string matching the regular expression below qualifies as a parameter

````js
util.paramRE = /(^|\W)\:([^(?#/.: ]+)(\([^)]*?\)+)?/g;
````

[Go to http://regexr.com/](http://regexr.com/) and test it out.

> Characters should be escaped i.e. `\\w+`

### parth.match(path[, opt])

Obtain a path matching one of the previously paths set.

_arguments_
- `path` type `string`
- `opt` type `object` optional, with all extra information:
  - path: the `path` given as an input
  - url: if any, the url contained within the `path` given
  - depth: integer representing the `depth` of the path
  - params: object with a map between labels and the path.
  - notFound: `false` if perfect match, what is left after the match if not

_return_
  - `null` for no matches or non-supported types
  - `regex` object matching the path given, with same properties of #set

> All matches partial i.e. /^regex baby/i.
> Not being strict is useful for `notFound` paths

### parth

The `parth` instance has one properties
 - `regex`: object with one key per `depth`, each being an array.
 - `regex.map`: map between paths and regexes for lookup

> When paths are set they are classified according to their `depth`

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
