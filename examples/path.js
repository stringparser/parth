'use strict';

var parth = require('../');
var use, pattern, args, result;

use = 'object paths';
pattern = 'hello.:there:\\w+.:you';
result = parth.set(pattern).get('hello.awesome.human');
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'unix paths';
pattern = '/hello/:there/:you';
result = parth.set(pattern).get('/hello/awesome/human');
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'url paths';
pattern = '/hello/:there/:you:\\w+/?:query';
args = '/awesome/human?you=matter';
result = parth.set(pattern)
  .get('/hello/awesome/human/?you=matter');
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'windows paths';
pattern = '\\hello\\:there\\:you';
args = ['awesome', 'human'];
result = parth.set(pattern).get('\\hello\\awesome\\human');
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'sentences';
pattern = 'you are an :there:\\w+ :you';
result = parth.set(pattern)
  .get('you are an awesome human');
console.log('\n ', use, '\n -- ');
console.log(result);

use = 'be specific';
pattern = '/hello/:one/:two?:three\\w+';
result = parth.set(pattern).get('/hello/there/awesome?you');
console.log('\n -- \n', use, '\n -- ');
console.log(result);
