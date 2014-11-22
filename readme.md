# node-parth [<img alt="progressed.io" src="http://progressed.io/bar/85" align="right"/>](https://github.com/fehmicansaglam/progressed.io)

[<img alt="build" src="http://img.shields.io/travis/stringparser/node-parth/master.svg?style=flat-square" align="left"/>](https://travis-ci.org/stringparser/node-parth/builds)
[<img alt="NPM version" src="http://img.shields.io/npm/v/parth.svg?style=flat-square" align="right"/>](http://www.npmjs.org/package/parth)
<p align="center">
  <a href="#install">install</a> |
  <a href="#documentation">documentation</a> |
  <a href="#why">why</a> |
  <a href="#todo">todo</a>  
</p>
<br><br>

path madness not only for an url

## usage

```js
var parth = new require('parth')();
```
#### object path

```js
parth
  .set('hello.:there(\\w+).:you')
  .get('hello.awesome.human');
// =>
{ input: 'hello.awesome.human',
  path: 'hello.:there(\\w+).:you',
  regexp: /^hello\.(\w+)\.([^\. ]+)\.?/i,
  argv: 'hello awesome human',
  depth: 3,
  params: { there: 'awesome', you: 'human' } }
```

#### unix/url paths

```js
parth
  .set('/hello/:there/:you(\\w+)')
  .get('/hello/awesome/human/?you=matter');
// =>
{ input: '/hello/awesome/human/?you=matter',
  path: '/hello/:there/:you',
  query: 'you=matter',
  regexp: /^\/hello\/([^\/ ]+)\/([^\/ ]+)\/?/i,
  argv: 'hello awesome human',
  depth: 3,
  params: { there: 'awesome', you: 'human' } }

```

#### fallbacks

````js
parth
  .get('/hello/there/you/awesome', { fallback : true });
 // =>
{ input: '/hello/there/you/awesome',
  path: '/hello/:there/:you',
  regexp: /^\/hello\/([^\/ ]+)\/([^\/ ]+)\/?/i,
  argv: 'hello there you awesome',
  depth: 4,
  fallback: true,
  params: { there: 'there', you: 'you' } }
````

#### mixing them up

```js
parth
  .set(':method(get|put|delete|post) :model.data /hello/:one/:two?something')
  .get('get page.data /hello/there/awesome.json?page=10');
// =>
{ input: 'get page.data /hello/there/awesome.json?page=10',
  path: ':method(get|put|delete|post) :model.data /hello/:one/:two',
  query: 'page=10',
  regexp: /^(get|put|delete|post)[ ]+([^\. ]+)\.data[ ]+\/hello\/([^\/ ]+)\/([^\/ ]+)\/?/i,
  argv: 'get page data hello there awesome.json',
  depth: 6,
  params:
   { method: 'get',
     model: 'page',
     one: 'there',
     two: 'awesome.json' } }

```

## documentation

````js
var Parth = require('parth');
var parth = new Parth(/* your cache */)
````

### var parth = Parth([cache])

Constructor of `parths`.

Takes one optional argument. The `parth` instance `cache` that will be created.

### parth(path, opts)

Same as **path.set**.

### parth.set(path, opts)

Chainable method. Set a new path so it can be set / matched

- `path`: string or array with the path to be set.
- `opts`: object that will override property defaults for: `sep` or `tokens`.

Any alphanumeric character starting with a colon, i.e. `:my-parameter`, qualifies as parameter. After it a custom regular expression can be given to match a parameter. The regular expression **must start and end with parenthesis**.

Examples of valid regular expressions next to parameters
```js
parth.set('myObject.:method.:property(\\w+)');
parth.set(':method:get|post|put|delete :page(\\w+?).data /page/:view(\\d)/some');
parth.set(
  'Come to :here:Granada|Berlin|NY, ' +
  'we have :something:paella|beer|awesomeness '+
  'for :you(\\w+|everyone)');
```

### parth.get(path, opts)

Obtain a path previously saved with `parth.set`

- `path`: string or array with the path to be get.
- `opts`: object that will override property defaults for internal `sep` and `params` regexes.

Returns an object with the following properties

- `input`: the input
- `path`: the path that matches the imput
- `query`: if path contains an url, will hold the query including without '?'
- `regexp`: the regexp used to match a path with `parth.get`
- `params`: the previously set `:paramateters` on the path
- `argv`: an array of with all the non token strings of the input
- `depth` : `argv.length`
- `fallback`: whether or not the path has fallen back from another

if the `path` is not defined, or doesn't match, `null` is returned

```js
parth
  .set(':number(\\d+) paths on fire')
  .get('my paths on fire')
// => null
```

### parth.cache

The `parth` instance cache. Has 3 properties

 - `masterRE` : array containing a regular expression for each depth.
 - `regexps`: a matrix of one column and one row for each path depth set.
 - `paths`: same as `regexps` but for the paths set.

### note mixed parths

Mixed paths are based on space being the "separator" of them. As long as space is used as a separator alls good.

## why

I need it for [runtime](https://github.com/stringparser/runtime) module.

## install

    $ npm install --save parth

### test

    $ npm test

### todo

 - [ ] admit a regexp as input

### license

[<img alt="LICENSE" src="http://img.shields.io/npm/l/parth.svg?style=flat-square"/>](http://opensource.org/licenses/MIT)
