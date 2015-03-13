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

## usage

```js
var parth = new require('parth')();
```

_set_

```js
parth.set('get /:page(\\w+(?:end))/baby user.:data(\\d+).:drink :when')
{
  /^get \/(\w+(?:end))\/baby user\.(\d+)\.([^u ]+) ([^: ]+)/i
  path: 'get /:page(\\w+(?:end))/baby user.:data(\\d+).:drink :when',
  argv: [
    'get',
    '/:page(\\w+(?:end))',
    '/baby',
    'user.',
    ':data(\\d+).',
    ':drink',
    ':when'
  ],
  cus: 2,
  def: 2
}
```
_get_

```js
var extra = { };
parth.get('get /weekend/baby/?query=string#hash user.10.beers now', extra)
{
  /^get \/(\w+(?:end))\/baby user\.(\d+)\.([^u ]+) ([^: ]+)/i
  path: 'get /:page(\\w+(?:end))/baby user.:data(\\d+).:drink :when',
  argv: [
    'get',
    '/:page(\\w+(?:end))',
    '/baby',
    'user.',
    ':data(\\d+).',
    ':drink',
    ':when'
  ],
  cus: 2,
  def: 2
}

console.log(extra);
{
  url: '/weekend/baby?query=string#hash',
  path: 'get /weekend/baby user.10.beers now',
  argv: [ 'get', '/weekend', '/baby', 'user.', '10.', 'beers', 'now' ],
  notFound: false,
  depth: 7,
  match: 'get /weekend/baby user.10.beers now',
  params:  {
    _: [ 'page', 'data', 'drink', 'when' ],
    page: 'weekend',
    data: '10',
    drink: 'beers',
    when: 'now'
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

### parth.set(path)

Create a regular expression from a string. Store if for later looked up.

_arguments_
- `path` type `string`

_return_
  - `regex` object with properties below
    - path: the input path sanitized
    - argv: normalized path vector
    - def: number of default regexes used for set
    - cust: number of custom regexes parsed for set

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

### parth.get(path[, opt])

Obtain a path matching one of the previously paths set.

_arguments_
- `path` type `string`
- `opt` type `object` optional, with all extra information:
  - url: if any, the url contained within the `path` given
  - path: the `path` given as an input
  - argv: normalized path vector
  - depth: integer representing the `depth` of the path (argv.length)
  - params: object with a map between labels and the path.
  - notFound: `false` if perfect match, what is left after the match if not

_return_
  - `null` for no matches
  - `regex` object maching the path given, with properties:
    - url: if any, the url contained within the `path` given
    - path: the `path` of the previosly set path
    - argv: normalized path vector of the path set


> All matches partial i.e. /^regex baby/i. Not being strict is useful for `notFound` paths

### parth

The `parth` instance has 3 properties
 - `store`: all previously set paths live here
 - `regex`: object with one key per `depth`, each being an array.
 - `master`: array aggregating a regular expression for each `depth`.

> When paths are set they are classified according to their `depth`

## why

I need it for the [runtime](https://github.com/stringparser/runtime) module.

## install

With [npm](http://npmjs.org)

    npm install --save parth

### examples
 Run the [`example.js`](example.js) file.

### test

    $ npm test

```
➜  node-parth (master) ✓ npm test
parth
  paths
    ✓ object
    ✓ raw object paths
    ✓ unix paths
    ✓ raw unix paths
    ✓ urls
    ✓ raw urls
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


15 passing (18ms)
```

### todo

 - [ ] add support for regexp input

### license

![LICENSE](http://img.shields.io/npm/l/parth.svg?style=flat-square)
