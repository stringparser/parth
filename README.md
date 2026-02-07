# parth [![NPM version][badge-version]][x-npm] [![downloads][badge-downloads]][x-npm]

[documentation](#documentation) -
[examples](#examples) -
[install](#install) -
[todo](#todo) -
[why](#why)

## sample

```js
import Parth from 'parth';

const parth = new Parth();
var props = {handle: function(){}};

parth.set('(get|post) /:page/:view', props)
     .get('get /weekend/baby?query=string#hash user.10.beers now')
// =>
{
  path: 'get /:page/:view',
  stem: ':0(get|post) /:page/:view:qs(?:\\/?)?([?#][^\\/\s]*)?',
  depth: 2,
  regex: /^(get|post) \/([^?#.\/\s]+)\/([^?#.\/\s]+)(?:\/?)?([?#][^\/\s]*)?/,
  match: 'get /weekend/baby?query=string#hash',
  handle: [Function],
  notFound: ' user.10.beers now',
  params: {
    page: 'weekend',
    view: 'baby',
    qs: '?query=string#hash'
  }
}
```

## documentation

Parth exports a `Parth` class (default export)

```js
import Parth from 'parth';
```

which can take the options below

```js
var parth = new Parth(options);
```

_options_ type `object`, can be
 - `options.defaultRE` default `regex` used if none is given after the params

example:

```js
const parth = new Parth({ defaultRE: /[^\s\/?#]+/ });

parth.set('/page/:view') // no regex given after ":view"
     .get('/page/10/?query=here')
// =>
{
  path: '/page/:view/',
  stem: '/page/:view:qs(?:\\/?)([?#][^\\/\\s]*)?',
  depth: 2,
  regex: /^\/page\/([^\s\/?#]+)(?:\/?)([?#][^\/\s]*)?/,
  match: '/page/10/?query=here',
  params: {
    view: '10',
    qs: '?query=here'
  },
  notFound: ''
}
```

> NOTE: the query string is separated by default and assigned to `qs`.
> This will only happen if the path given to `parth.set` has no query string

## parth.set

```js
function set(string path[, object options])
```
This method job is to sanitize `path` and order it with those previously stored.

_arguments_
 - `path`, type `string`, path to be set
 - `options`, type `object`, to merge with this path properties

_returns_ `this`

> NOTE: `options` is deep cloned beforehand to avoid mutation

`path` can contain any number of parameters(regexes) in the form
```js
 :param-label(\\regexp(?:here))
```
Any string matching the regular expression below qualifies as a parameter

````js
/:([-\w]+)(\([^\s]+?[)][?)]*)?/g;
````

[Go to http://regexr.com/](http://regexr.com/3cuqq) and test it out.

## parth.get
```js
function get(string path)
```

Take a string and return a clone of the store object properties

_arguments_
 - `path`, type `string` to match stored paths with

_return_
 - null for non-supported types or not matching paths
 - object with all the information stored in `parth.set`

> All matches are partial i.e. /^regex baby/.
> Not being strict is useful for `notFound` paths.
>
> NOTE: the returned object is a deep copy of the original `options`
> given in `parth.set` to avoid mutation

### TypeScript

Parth is written in TypeScript and ships with type definitions. Import types as needed:

```ts
import Parth, { ParthOptions, ParthResult } from 'parth';
```

## why

I need it for the [gulp-runtime](https://github.com/stringparser/gulp-runtime) module.

## install

With [npm](http://npmjs.org)

    npm install --save parth

### examples

Run the [`example.ts`](example.ts) file: `npx tsx example.ts` (or `npm run dist` then run with Node after changing the import to `./dist`).

### test

    npm test

```
➜  parth npm test
PASS test/paths.test.ts
PASS test/params.test.ts
PASS test/options.test.ts
PASS test/notFound.test.ts

Test Suites: 4 passed, 4 total
Tests:       20 passed, 20 total
```

### license

The MIT License (MIT)

Copyright (c) 2014-present Javier Carrillo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[x-npm]: https://npmjs.org/package/parth
[badge-version]: http://img.shields.io/npm/v/parth.svg?style=flat-square
[badge-downloads]: http://img.shields.io/npm/dm/parth.svg?style=flat-square
