# node-parth [<img alt="progressed.io" src="http://progressed.io/bar/65" align="right"/>](https://github.com/fehmicansaglam/progressed.io)

[<img alt="build" src="http://img.shields.io/travis/stringparser/node-parth/master.svg?style=flat-square" align="left"/>](https://travis-ci.org/stringparser/node-parth/builds)
[<img alt="NPM version" src="http://img.shields.io/npm/v/parth.svg?style=flat-square" align="right"/>](http://www.npmjs.org/package/parth)
<br><br>

express-like string path madness not only for urls

### usage

```js
var parth = require(parth)();
var use, result;

use = 'object paths';
result = parth
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

use = 'unix paths';
result = parth
  .set('/hello/:there/:you')
  .get('/hello/awesome/human');
// =>
// { input: '/hello/awesome/human',
//  path: '/hello/:there/:you',
//  sep: '/',
//  tokens: /[\/\# ]+/g,
//  depth: 2,
//  regexp: /^\/hello\/(\S+)\/(\S+)\/?/,
//  argv: [ 'hello', 'awesome', 'human' ],
//  params: { there: 'awesome', you: 'human' } }

use = 'url paths';
result = parth
  .set('/hello/:there/:you:\\w+/?:query')
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

use = 'windows paths';
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

use = 'mixed';
result = parth
  .set(':method:\\w+ /hello/:one/:two?you')
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
````

`Parth` is a constructor of `parths`. Takes only one possible argument.
The `cache` of a `parth`.

### parth(path, opts)

 Same as `path.get`.

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
- `regexp`: the regexp used to match maths wit `parth.get`
- `argv`: an array of all the non token strings of the input
- `params`: the previously set `:paramateters` on the path

### parth.set(path, opts)

Set a new path so it can be matched

- `path`: string or array with the path to be set.
- `opts`: object that will override property defaults for: `sep` or `tokens`.

All any alphabetical starting with a colon (`:my-parameter`) will qualify as parameters. After any parameter a custom regular expression can be given to match a parameter, if not given it will default to '\S+'.

Examples of valid regular expressions next to parameters
```js
parth.set(':method:get|post|put|delete /page/:view/:partial')
parth.set('myObject.:method.:property:(\w+)')
parth.set('come :here and see what we have prepared for :you')
```

The regular expression does not have to start and finish with parenthesis.

### parth.cache

An object with `parth` instance cache has 3 properties

 - `masterRE` : array containing a regular expression for each depth.
 - `regexps`: a matrix of one column and one row for each path depth set.
 - `paths`: same as `regexps` but for the paths set.

## install

    $ npm install --save parth

### test

    $ npm test

### todo

 - [ ] admit a regexp as input
 - [ ] admit to input parameters as an object on `parth.get`

### license

[<img alt="LICENSE" src="http://img.shields.io/npm/l/parth.svg?style=flat-square"/>](http://opensource.org/licenses/MIT)
