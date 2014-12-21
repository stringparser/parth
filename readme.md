# parth
[<img alt="build" src="http://img.shields.io/travis/stringparser/parth/master.svg?style=flat-square" align="left"/>](https://travis-ci.org/stringparser/parth/builds)
[<img alt="NPM version" src="http://img.shields.io/npm/v/parth.svg?style=flat-square" align="right"/>](http://www.npmjs.org/package/parth)
<p align="center">
  <b>
  <a href="#documentation">documentation</a> -
  <a href="#examples">examples</a> -
  <a href="#install">install</a> -
  <a href="#todo">todo</a> -
  <a href="#why">why</a>
  </b>
</p>

path to regexp madness not only for an url

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
  argv:  [ 'get', '/:page(\\w+(?:end))', '/baby',
           'user.', ':data(\\d+).', ':drink', ':when' ],
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
  argv:  [ 'get', '/:page(\\w+(?:end))', '/baby',
           'user.', ':data(\\d+).', ':drink', ':when' ],
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
    argv:  [ 'get', '/:page(\\w+(?:end))', '/baby',
             'user.', ':data(\\d+).', ':drink', ':when' ],
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
    - path: the input path sanitized
    - argv: normalized path vector
    - def: number of default regexes used to set
    - cust: number of custom regexes parsed for set

`path` can contain any number of parameters(regexes) in the form
```js
 :param-label(\\regexp(?:here))
```
Any string matching the regular expression below qualifies as a parameter

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

> All matches partial i.e. /^regex baby/i. Not being strict is useful for `notFound` paths

### parth.store

The `parth` instance `store`. Has 3 properties
 - `cache`: all previously set paths live here
 - `regex`: object with one key per `depth`, each being an array.
 - `masterRE` : array aggregating a regular expression for each `depth`.

> When paths are set they are classified according to their `depth`

## why

I need it for the [runtime](https://github.com/stringparser/runtime) module.

## install

    $ npm install --save parth

### examples
 Run the [`example.js`](example.js) file.

### test

    $ npm test

```
➜  node-parth (master) ✓ npm test
parth
  args
    ✓ should handle string args for #set and #get
    ✓ should handle array args for #set and #get
    ✓ should handle array args for #set string for #set
    ✓ should handle string args for #set array for #get
  unix-paths
    ✓ should handle unix paths
  notFound
    ✓ should handle urls and spaces
    ✓ should handle urls spaces and object paths
    ✓ should handle urls spaces and object paths
  object-paths
    ✓ should handle object paths
    ✓ should handle object paths with regexes 
  sentences
    ✓ should handle space separated strings
  combined
    ✓ should handle urls and spaces
    ✓ should handle urls spaces and object paths
  params
    ✓ should handle urls and spaces
    ✓ should handle urls spaces and object paths

15 passing (19ms)
```

### todo

 - [ ] add support for regexp input

### license

[<img alt="LICENSE" src="http://img.shields.io/npm/l/parth.svg?style=flat-square"/>](http://opensource.org/licenses/MIT)
