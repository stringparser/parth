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
```

#### url paths

```js
parth
  .set('/hello/:there/:you(\\d+)')
  .get('/hello/awesome/10.10/?you=matter');
// =>
{ input: '/hello/awesome/10.10/?you=matter',
  path: '/hello/awesome/10.10',
  stems: '/hello/:there/:you(\\d+)',
  url:
   { href: '/hello/awesome/10.10/?you=matter',
     hash: null,
     query: 'you=matter',
     pathname: '/hello/awesome/human' },
  depth: 2,
  regexp: /^\/hello\/([^\/\#\? ]+)\/(\w+)\/?/i,
  notFound: false,
  params: { there: 'awesome', you: 10.10 } }

```

#### object paths

```js
parth
  .set('hello.:there(\\w+).:you')
  .get('hello.awesome.human');
// =>
{ input: 'hello.awesome.human',
  path: 'hello.awesome.human',
  stems: 'hello.:there(\\w+).:you',
  depth: 2,
  regexp: /^hello\.(\w+)\.([^\. ]+)/i,
  notFound: false,
  params: { there: 'awesome', you: 'human' } }
```

#### not found!

````js
parth
  .get('/hello/there/you/awesome', { fallback : true });
 // =>
{ input: '/hello/there/you/awesome',
  path: '/hello/there/you/awesome',
  stems: '/hello/:there/:you(\\w+)',
  url:
   { href: '/hello/there/you/awesome',
     hash: null,
     query: null,
     pathname: '/hello/there/you/awesome' },
  depth: 2,
  regexp: /^\/hello\/([^\/\#\? ]+)\/(\w+)\/?/i,
  notFound: true,
  params: { there: 'there', you: 'you' } }
````

#### mix'em up

```js
parth
  .set(':method(get|put|delete|post) :model.data /hello/:one/:two?something')
  .get('get page.data /hello/there/awesome.json?page=10');
// =>
{ input: 'get page.data /hello/there/awesome.json?page=10',
  path: 'get page.data /hello/there/awesome.json',
  stems: ':method(get|put|delete|post) :model.data /hello/:one/:two',
  url:
   { href: '/hello/there/awesome.json?page=10',
     hash: null,
     query: 'page=10',
     pathname: '/hello/there/awesome.json' },
  depth: 5,
  regexp: /^(get|put|delete|post) ([^\. ]+)\.data \/hello\/([^\/\#\? ]+)\/([^\/\#\? ]+)\/?/i,
  notFound: false,
  params:
   { method: 'get',
     model: 'page',
     one: 'there',
     two: 'awesome.json' } }

```

## documentation

````js
var Parth = require('parth');
````

`Parth` constructor. Takes no arguments.

```js
var parth = new Parth();
```

### parth.boil(path[, opts])

Normalize a path returning an array.

arguments
- `path` type `string` or `array`
- `opts` type `object` holding all extra information

return
- `opts.stems` array with the normalized path

After the function call, all properties are available at the object passed to `opts`.

See [parth.get](#parthgetpath-opts) `opts` properties.

### parth.set(path[, opts])

Set a string or array path using its normalized form from `parth.boil`

arguments
- `path` type `string` or `array`
- `o` type `object` optional holding all extra information

return
- `this` so the method can be chained

`path` can contain any parameters in the form `:param-label$thing(regexp)` either if the path was given as a string or an array. Any string matching the regular expression below qualifies as a parameter

````js
util.paramRE = /\:([^\/\\\?\#\.\( ]+)(\(.+?\))?/g
````
[Go to regexpr](http://regexr.com/) and test it out.

NOTE: there is no overwrite of previous normalized paths, returning early if the path was set previously.

### parth.get(path[, opts])

Obtain a path match previously set with `parth.set`

arguments
- `path` type `string` or `array`
- `opts` type `object` holding all extra information

return
  object with properties below
- `input`: the given input
- `path`: normalized path (no querystring or hash and sanitized)
- `stems`: `string` for `parth.get` with the original path set. `array` for `parth.set` with the normalized path.
- `url`: url contained in the matched path, object with properties
  - href: complete path
  - query: querystring without the '?' sign
  - hash: hash including the pound sign
- `depth`: depth of the normalized path
- `regexp`: regexp used to match a path and obtain the parameters
- `notFound`: does the input match but does not correspond to a path set?
- `params`: parameters object with the parameters set previously, numbers are parsed.

These same properties are attached to `opts` of `path.get(path[, opts])`.

If the `path` does not match any of the defined null is returned. All properties, including the regexp used for matching are at `opts`.

```js
parth
  .set(':number(\\d+) paths on fire')
  .get('my paths on fire')
// => null
```

### parth.cache

The `parth` instance cache. Has 3 properties

 - `masterRE` : array containing a regular expression for each depth.
 - `regexp`: a matrix of one column and one row for each path depth set.
 - `paths`: same as `regexp` but for the paths set. Used at the begining of `parth.set` to see if the path was previosly set.

## why

I need it for what is becoming an awesome, simple and complete [runtime](https://github.com/stringparser/runtime) module.

## install

    $ npm install --save parth

### test

    $ npm test

### examples

 Run the [`example.js`](example.js) file.

### todo

 - [ ] implement regexp paths
 - [ ] provide more examples

### license

[<img alt="LICENSE" src="http://img.shields.io/npm/l/parth.svg?style=flat-square"/>](http://opensource.org/licenses/MIT)
