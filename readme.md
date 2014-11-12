# node-parth [<img alt="progressed.io" src="http://progressed.io/bar/70" align="right"/>](https://github.com/fehmicansaglam/progressed.io)

[<img alt="build" src="http://img.shields.io/travis/stringparser/node-parth/master.svg?style=flat-square" align="left"/>](https://travis-ci.org/stringparser/node-parth/builds)
[<img alt="NPM version" src="http://img.shields.io/npm/v/parth.svg?style=flat-square" align="right"/>](http://www.npmjs.org/package/parth)
<br><br>
<p align="center">part, part, part, ... (image from
  <a href="http://huch-a9346.deviantart.com">huch's</a>)</p>
<p align="center">
  <a hef="http://huch-a9346.deviantart.com/">
    <img height="200" src="https://raw.githubusercontent.com/stringparser/node-parth/master/img/hugh__part_the_green_avenger_plushy__by_huch_a9346-d58cal7.gif" />
</p>
</a>

express like string/array paths not only urls

### usage

```js
var part = require('parth');
var use, pattern, path, result;

use = 'object paths';
pattern = 'hello.:there.:you';
path = 'hello.awesome';
result = part(pattern, path);
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'unix paths';
pattern = '/hello/:there/:you';
path = ['hello', 'awesome','human'];
result = part(pattern, path);
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'url paths';
pattern = '/hello/:there/:you/?:query';
path = '/awesome/human?you=matter';
result = part(pattern, path);
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'windows paths';
pattern = '\\hello\\:there\\:you';
path = ['awesome', 'human'];
result = part(pattern, path);
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'sentences';
pattern = 'you are an :there :you';
path = (function(){ return arguments; })('awesome', 'human');
result = part(pattern, path);
console.log('\n ', use, '\n -- ');
console.log(result);

use = 'be specific';
pattern = '/hello/:one/:two?:three';
path = {one : 'there', two : 'impecable', three : 'human=being'};
result = part(pattern, path);
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'compose';
path = ['kick', 'ass', 'human'];
pattern = 'hey :there:you :person';
result = part(pattern, path);
console.log('\n -- \n', use, '\n -- ');
console.log(result);
```
output

````sh
--
 object paths
 --
{ pattern: 'hello.:there.:you',
  sep: /[.]+/g,
  params: { there: 'awesome', you: null },
  argv: [ 'hello', ':there', ':you' ],
  index: 1,
  path: [ 'awesome' ],
  depth: 2,
  matches: 1,
  parse: [Function: parse],
  path: 'hello.awesome' }

 --
 unix paths
 --
{ pattern: '/hello/:there/:you',
  sep: /[\/\#\?]+/g,
  params: { there: 'awesome', you: 'human/should' },
  argv: [ 'hello', ':there', ':you' ],
  index: 1,
  path: [ 'awesome', 'human/should' ],
  depth: 2,
  matches: 2,
  parse: [Function: parse],
  path: '/hello/awesome/human/should' }

 --
 url paths
 --
{ pattern: '/hello/:there/:you/?:query',
  sep: /[\/\#\?]+/g,
  params: { there: 'awesome', you: 'human', query: 'you=matter' },
  argv: [ 'hello', ':there', ':you', ':query' ],
  index: 1,
  path: [ 'awesome', 'human', 'you=matter' ],
  depth: 3,
  matches: 3,
  parse: [Function: parse],
  path: '/hello/awesome/human/?you=matter' }

 --
 windows paths
 --
{ pattern: '\\hello\\:there\\:you',
  sep: /[\\\#\?]+/g,
  params: { there: 'awesome', you: 'human' },
  argv: [ 'hello', ':there', ':you' ],
  index: 1,
  path: [ 'awesome', 'human' ],
  depth: 2,
  matches: 2,
  parse: [Function: parse],
  path: '\\hello\\awesome\\human' }

  sentences
 --
{ pattern: 'you are an :there :you',
  sep: /[ ]+/g,
  params: { there: 'awesome', you: 'human' },
  argv: [ 'you', 'are', 'an', ':there', ':you' ],
  index: 3,
  path: { '0': 'awesome', '1': 'human' },
  depth: 2,
  matches: 2,
  parse: [Function: parse],
  path: 'you are an awesome human' }

 --
 be specific
 --
{ pattern: '/hello/:one/:two?:three',
  sep: /[\/\#\?]+/g,
  params: { one: 'there', two: 'impecable', three: 'human=being' },
  argv: [ 'hello', ':one', ':two', ':three' ],
  index: 1,
  path: { one: 'there', two: 'impecable', three: 'human=being' },
  depth: 3,
  matches: 3,
  parse: [Function: parse],
  path: '/hello/there/impecable?human=being' }

 --
 compose
 --
{ pattern: 'hey :there:you :person',
  sep: /[ ]+/g,
  params: { there: 'kick', you: 'ass', person: 'human' },
  argv: [ 'hey', ':there:you', ':person' ],
  index: 1,
  path: [ 'kick', 'ass', 'human' ],
  depth: 3,
  matches: 3,
  parse: [Function: parse],
  path: 'hey kickass human' }

````

## documentation

````js
var part = require('parth');
````

### part(pattern, path)

 - `pattern`: string or array to part with path.
 - `path`: string, array, arguments or plain object.

All **words** starting with a colon (`:parameter`) will qualify as parameters.
The function returns an object with the following properties

- `pattern`: the original pattern
- `sep`: what token(s) separate the pattern, defaults to `' '`.
- `params`: parameters found in the string/array
- `depth` : how many parameters are there in params.
- `argv`: an array representing a possible path to investigate
- `index`: where is the first parameter on `argv`
- `path`: the path to match the params
- `matches`: how many `parameters` were used
- `path`: path with the parameters replaced
- `parse(path [, opts])`:
  function to recompute the `path` property.
  Takes two arguments:
   - `path`, the new arguments to map into the pattern.
   - `opts.index`, path should be sliced before the mapping from here.

You would likely use the module without arguments and after use `parse`.

The output is fault tolerant letting you to decide what to do with it.

## install

    $ npm install --save parth

### test

    $ npm test

### license

[<img alt="LICENSE" src="http://img.shields.io/npm/l/parth.svg?style=flat-square"/>](http://opensource.org/licenses/MIT)
