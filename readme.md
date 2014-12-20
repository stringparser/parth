# parth
[<img alt="build" src="http://img.shields.io/travis/stringparser/parth/master.svg?style=flat-square" align="left"/>](https://travis-ci.org/stringparser/parth/builds)
[<img alt="NPM version" src="http://img.shields.io/npm/v/parth.svg?style=flat-square" align="right"/>](http://www.npmjs.org/package/parth)
<p align="center">
  <a href="#install">install</a> |
  <a href="#documentation">documentation</a> |
  <a href="#why">why</a> |
  <a href="#examples">examples</a> |
  <a href="#todo">todo</a>
</p>
<br>

path to regexp madness not only for urls

## usage

```js
var parth = new require('parth')();
```

_set_

```js
parth.set('get /:page(\\w+(?:end))/baby user.:data(\\d+).:drink :when') // =>
{ /^get \/(\w+(?:end))\/baby\/?(?:[^ ])? user\.(\d+)\.([^\. ]+) ([^\. ]+)/i
  url: '/:page(\\w+(?:end))/baby',
  path: 'get /:page(\\w+(?:end))/baby user.:data(\\d+).:drink :when',
  argv:
  [ 'get',
  '/:page(\\w+(?:end))',
  '/baby',
  'user.',
  ':data(\\d+).',
  ':drink',
  ':when' ],
  depth: 5
}
```
_get_

```js
var extra = { };
parth.get('get /weekend/baby/?query=string#hash user.10.beers now', extra)
// =>
{ /^get \/(\w+(?:end))\/baby\/?(?:[^ ])? user\.(\d+)\.([^\. ]+) ([^\. ]+)/i
  notFound: false,
  url: '/weekend/baby?query=string#hash',
  path: 'get /weekend/baby user.10.beers now',
  argv:
  [ 'get',
  '/:page(\\w+(?:end))',
  '/baby',
  'user.',
  ':data(\\d+).',
  ':drink',
  ':when' ],
  params: {
    _: [ 'weekend', 10, 'beers', 'now' ],
    page: 'weekend',
    data: 10,
    drink: 'beers',
    when: 'now'
  }
}

console.log(extra);
// =>
{ notFound: false,
  path: 'get /weekend/baby user.10.beers now',
  url: '/weekend/baby?query=string#hash',
  found: [ 'get /weekend/baby user.10.beers now' ],
  depth: 5,
  index: 4,
  regex: { /^get \/(\w+(?:end))\/baby\/?(?:[^ ])? user\.(\d+)\.([^\. ]+) ([^\. ]+)/i
    path: 'get /:page(\\w+(?:end))/baby user.:data(\\d+).:drink :when',
    argv:
    [ 'get',
    '/:page(\\w+(?:end))',
    '/baby',
    'user.:data(\\d+).:drink',
    ':when' ],
    def: 2,
    cust: 2
  },
  params: {
    _: [ 'weekend', 10, 'beers', 'now' ],
    page: 'weekend',
    data: 10,
    drink: 'beers',
    when: 'now'
  }
}
```

## documentation

````js
var Parth = require('parth');
````

`Parth` constructor. Takes no arguments.

```js
var parth = new Parth();
```

### parth.set(path)

Set a string or array path

_arguments_
- `path` type `string` or `array`

_return_
  - `regex` object with properties below
    - url: if any, the url contained within the path
    - path: the input path sanitized
    - argv: normalized path vector
    - depth: length of `argv`

`path` can contain parameters in the form
```js
 :param-label(\\regexp(?:here))
```
That is, parameters should start with a colon. Any string matching the regular expression below qualifies as a parameter

````js
util.paramRE = /(^|\W)\:([^()?#\.\/ ]+)(\(+[^ ]*\)+)?/g;
````

[Go to regexpr](http://regexr.com/) and test it out.

> Characters should be escaped i.e. `\\w+` <br>
> For now, only one group per parameter is allowed

### parth.get(path[, o])

Obtain a path matching what was previously set.

_arguments_
- `path` type `string` or `array`
- `o` type `object` holding all extra information

_return_
  - `null` for no matches
  - `regex` object maching the path given, with properties:
   - notFound: wether or not the it was a complete match of the path given
   - url: if any, the url contained within the `path` given
   - path: the `path` given as an input
   - argv: normalized path vector
   - params: object with a map between labels and the path. Numbers are parsed.

> Partial matching is allowed. Strict at the beginning, not at the end. Strict matches give no useful information about `notFound` paths

### parth.store

The `parth` instance cache. Has 3 properties
 - `_`: all set paths are stored here
 - `regexp`: an object with one key per `depth` of the path.
 - `masterRE` : array containing a regular expression for each `depth`.

> When paths are set they are classified according to their `depth`

## why

I need it for the [runtime](https://github.com/stringparser/runtime) module.

## install

    $ npm install --save parth

### test

    $ npm test

### examples

 Run the [`example.js`](example.js) file.

### todo

 - [ ] add support for regexp input

### license

[<img alt="LICENSE" src="http://img.shields.io/npm/l/parth.svg?style=flat-square"/>](http://opensource.org/licenses/MIT)
