# node-parth
[<img alt="build" src="http://img.shields.io/travis/stringparser/node-parth/master.svg?style=flat-square" align="left"/>](https://travis-ci.org/stringparser/node-parth/builds)
[<img alt="NPM version" src="http://img.shields.io/npm/v/parth.svg?style=flat-square" align="right"/>](http://www.npmjs.org/package/parth)
<p align="center">
  <a href="#install">install</a> |
  <a href="#documentation">documentation</a> |
  <a href="#why">why</a> |
  <a href="#examples">examples</a> |
  <a href="#todo">todo</a>
</p>
<br>

path to regexp madness not only for an url

## usage

```js
var parth = new require('parth')();
var path = 'get /:page(\\w+(?:end))/baby user.:data(\\d+).:drink :when'

parth.set(path) // =>
{ /^get \/(\w+(?:end))\/baby\/?(?:[^ ])? user\.(\d+)\.([^\. ]+) ([^\. ]+)/i
  path: 'get /:page(\\w+(?:end))/baby user.:data(\\d+).:drink :when',
  def: 2,
  cust: 2 }

path = 'get /weekend/baby/?query=string#hash user.10.beers now';
var optional = { };
parth.get(path, optional)
// =>
{ /^get \/(\w+(?:end))\/baby\/?(?:[^ ])? user\.(\d+)\.([^\. ]+) ([^\. ]+)/
  path: 'get /:page(\\w+(?:end))/baby user.:data(\\d+).:drink :when',
  url: '/weekend/baby?query=string#hash',
  params: {
    _: [ 'weekend', 10, 'beers', 'now' ],
    page: 'weekend',
    data: 10,
    drink: 'beers',
    when: 'now'
  }
}

console.log(optional);
// =>
{ notFound: false,
  path: 'get /weekend/baby user.10.beers now',
  url: '/weekend/baby?query=string#hash',
  found: [ 'get /weekend/baby user.10.beers now' ],
  depth: 5,
  index: 4,
  regex:
{ /^get \/(\w+(?:end))\/baby\/?(?:[^ ])? user\.(\d+)\.([^\. ]+) ([^\. ]+)/i
  path: 'get /:page(\\w+(?:end))/baby user.:data(\\d+).:drink :when',
  argv:
  [ 'get',
  '/:page(\\w+(?:end))',
  '/baby',
  'user.:data(\\d+).:drink',
  ':when' ],
  def: 2,
  cust: 2 },
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

### parth.set(path[, o])

Set a string or array path

arguments
- `path` type `string` or `array`
- `o` type `object` holding all extra information: optional

return the path to `regex` object with properties below
  - path: the input path sanitized
  - url: if any, the url contained within the path
  - def: number of

`path` can contain parameters in the form
```js
 :param-label(\\regexp(?:here))
```
That is, parameters should start with a colon. Any string matching the regular expression below qualifies as a parameter

````js
util.paramRE = /(^|\W)\:([^()?#\.\/ ]+)(\(+[^ ]*\)+)?/g;
````

[Go to regexpr](http://regexr.com/) and test it out.

NOTES:
 - Characters should be escaped i.e. `\\w+`
 - For now, only one group per parameter is allowed

### parth.get(path[, o])

Obtain a path matching what was previously set.

arguments
- `path` type `string` or `array`
- `o` type `object` holding all extra information

return
  - `null` for no matches
  - `regex` object maching the path given, with properties:
   - notFound: wether or not the it was a complete match of the path given
   - path: the `path` given as an input
   - url: if any, the url contained within the `path` given
   - params: object with a map between labels and the path. Numbers are parsed.

NOTES:

Partial matching is allowed. Strict at the beginning, not at the end. Way useful `notFound` information rather than strict matches.

### parth.store

The `parth` instance cache. Has 3 properties
 - `_`: all set paths are stored here
 - `regexp`: an object with one key per `depth` of the path.
 - `masterRE` : array containing a regular expression for each `depth`.

NOTES:

When paths are set they are classified according to their `depth`, look at the `argv` array returned when giving two arguments.

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
