# node-parth [<img alt="progressed.io" src="http://progressed.io/bar/85" align="right"/>](https://github.com/fehmicansaglam/progressed.io)

[<img alt="build" src="http://img.shields.io/travis/stringparser/node-parth/master.svg?style=flat-square" align="left"/>](https://travis-ci.org/stringparser/node-parth/builds)
[<img alt="NPM version" src="http://img.shields.io/npm/v/parth.svg?style=flat-square" align="right"/>](http://www.npmjs.org/package/parth)
<br><br>

express-like string path madness not only for an url

## usage

```js
var parth = require(parth)();
```
### object path

```js
parth
  .set('hello.:there:\\w+.:you')
  .get('hello.awesome.human');
// =>
// { input: 'hello.awesome.human',
//  path: 'hello.:there:\\w+.:you',
//  sep: '.',
//  tokens: /[. ]+/g,
//  depth: 2,
//  regexp: /^hello.(\w+).(\S+)\.?/,
//  argv: [ 'hello', 'awesome', 'human' ],
//  params: { there: 'awesome', you: 'human' } }
```

### unix/url paths

```js
parth
  .set('/hello/:there/:you:\\w+')
  .get('/hello/awesome/human/?you=matter');
// =>
// { input: '/hello/awesome/human/?you=matter',
//  path: '/hello/:there/:you',
//  sep: '/',
//  tokens: /[\/\# ]+/g,
//  query: '?you=matter',
//  depth: 2,
//  regexp: /^\/hello\/(\S+)\/(\S+)\/?/,
//  argv: [ 'hello', 'awesome', 'human' ],
//  params: { there: 'awesome', you: 'human' } }
```
### windows path

```js
use = 'windows';
result = parth
  .set('\\hello\\:there\\:you')
  .get('\\hello\\awesome\\human');
// =>
// { input: '\\hello\\awesome\\human',
//  path: '\\hello\\:there\\:you',
//  sep: '\\',
//  tokens: /[\\\# ]+/g,
//  depth: 2,
//  /^\\hello\\(\S+)\\(\S+)\\?/,
//  argv: [ 'hello', 'awesome', 'human' ],
//  params: { there: 'awesome', you: 'human' } }
```

### mixed

```js
parth
  .set(':method:get|put|delete|post /hello/:one/:two?you')
  .get('get /hello/there/awesome?you');
// =>
//{ input: 'get /hello/there/awesome?you',
//  path: ':method:\\w+ /hello/:one/:two',
//  sep: '/',
//  tokens: /[\/\# ]+/g,
//  query: '?you',
//  depth: 3,
//  regexp: /^(get|put|delete|post)[ ]+\/hello\/(\S+)\/(\S+)\/?/
//  argv: [ 'get', 'hello', 'there', 'awesome' ],
//  params: { method: 'get', one: 'there', two: 'awesome' } }


```

## documentation

````js
var Parth = require('parth');
var parth = Parth(/* another parth.cache */)
````

### var parth = Parth([cache])

Constructor of `parths`.

Takes one optional argument. The `cache` of a `parth`.

### parth(path, opts)

Same as **path.get**.

### parth.get(path, opts)

Obtain a path previously saved with `parth.set`

- `path`: string or array with the path to be get.
- `opts`: object that will override property defaults for: `sep` or `tokens`.

Returns an object with the following properties

- `input`: the original path
- `path`: the path that matches the input
- `sep`: separation token, defaults to space.
- `tokens`: other tokens that might separate the path
- `query`: if path is an url, will hold the query including '?'
- `depth` : how many arguments we have after splitting with tokens
- `raw` : wether or not the path was set with parameters
- `regexp`: the regexp used to match maths wit `parth.get`
- `argv`: an array of all the non token strings of the input
- `params`: the previously set `:paramateters` on the path

if the `path` is not defined or doesn't match `null` is returned

```js
parth
  .set(':number:\\d+ paths on fire')
  .get('nine paths on fire')
// => null
```

### parth.set(path, opts)

Chainable method. Set a new path so it can be set / matched

- `path`: string or array with the path to be set.
- `opts`: object that will override property defaults for: `sep` or `tokens`.

Any alphanumeric character starting with a colon, i.e. `:my-parameter`, qualifies as parameter. After it a custom regular expression can be given to match a parameter, if not given it will default to '\S+'.

Examples of valid regular expressions next to parameters
```js
parth.set('myObject.:method.:property:(\\w+)');
parth.set(':method:get|post|put|delete /page/:view/:partial');
parth.set(
  'Come to :here:Granada|Berlin|NY, ' +
  'we have :something:paella|beer|awesomeness '+
  'for :you:(\\w+|everyone)');
```

The regular expression does not have to start and finish with parenthesis.

### parth.cache

An object with `parth` instance cache has 3 properties

 - `masterRE` : array containing a regular expression for each depth.
 - `regexps`: a matrix of one column and one row for each path depth set.
 - `paths`: same as `regexps` but for the paths set.

### note mixed parths

Mixed paths can have space as separator in addition to the path they have and thats how it works since a space is not really used elsewhere for a path (or it should not).

So as long as a space is used these are valid
```js
parth.set(':data /an/url/here')
parth.set(':model /an/url/here')
parth.set(':method /an/url/here')
```

## why

I need it for [runtime](https://github.com/stringparser/runtime) module.

## install

    $ npm install --save parth

### test

    $ npm test

### todo

 - [ ] implement failbacks
 - [ ] admit a regexp as input
 - [ ] admit to input parameters as an object on `parth.get`

### license

[<img alt="LICENSE" src="http://img.shields.io/npm/l/parth.svg?style=flat-square"/>](http://opensource.org/licenses/MIT)
