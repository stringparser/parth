'use strict';

var parth = require('../')();
var use, result;

use = 'object paths';
result = parth
  .set('hello.:there(\\w+).:you')
  .get('hello.awesome.human');
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'unix paths or urls';
result = parth
  .set('/hello/:there/:you')
  .get('/hello/awesome/human/?you=matter');
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'fallback';
result = parth
  .get('/hello/there/you/awesome', { fallback : true });
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'sentences';
result = parth
  .set('you are an :there(\\w+) :you')
  .get('you are an awesome human');
console.log('\n ', use, '\n -- ');
console.log(result);

use = 'mix';
result = parth
  .set(':method(get|put|delete|post) :model.data /hello/:one/:two?something')
  .get('get page.data /hello/there/awesome.json?page=10');
console.log('\n -- \n', use, '\n -- ');
console.log(result);
console.log();
console.log(parth.cache);
