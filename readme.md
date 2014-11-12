# node-parth [<img alt="progressed.io" src="http://progressed.io/bar/65" align="right"/>](https://github.com/fehmicansaglam/progressed.io)

[<img alt="build" src="http://img.shields.io/travis/stringparser/node-parth/master.svg?style=flat-square" align="left"/>](https://travis-ci.org/stringparser/node-parth/builds)
[<img alt="NPM version" src="http://img.shields.io/npm/v/parth.svg?style=flat-square" align="right"/>](http://www.npmjs.org/package/parth)
<br><br>

express-like string paths not only for urls

### usage



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

### todo

 - [ ] make it an instance
 - [ ] admit a regexp as input
 - [ ] admin an option to provide parameters
 - [ ] save invariants instead of complete paths
 - [ ] caches should be able to shared between instances

### license

[<img alt="LICENSE" src="http://img.shields.io/npm/l/parth.svg?style=flat-square"/>](http://opensource.org/licenses/MIT)
