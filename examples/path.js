'use strict';

var parth = require('../')();
var use, result;

use = 'object paths';
result = parth
  .set('hello.:there:\\w+.:you')
  .get('hello.awesome.human');
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'unix paths';
result = parth
  .set('/hello/:there/:you')
  .get('/hello/awesome/human');
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'url paths';
result = parth
  .set('/hello/:there/:you:\\w+/?:query')
  .get('/hello/awesome/human/?you=matter');
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'windows paths';
result = parth
  .set('\\hello\\:there\\:you')
  .get('\\hello\\awesome\\human');
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'sentences';
result = parth
  .set('you are an :there:\\w+ :you')
  .get('you are an awesome human');
console.log('\n ', use, '\n -- ');
console.log(result);

use = 'be specific';
result = parth
  .set('/hello/:one/:two?you')
  .get('/hello/there/awesome/?you');
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'mix';
result = parth
  .set(':method:get|put|delete|post /hello/:one/:two?:item=:number:\\d+')
  .get('get /hello/there/awesome?page=10');
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'controvert';
result = parth
  .set(
    'Come to :here:(Granada|Berlin|NY) ' +
    'we have :something:paella|beer|awesomeness '+
    'for :you'
  ).get(
   'Come to granada ' +
   'we have paella '+
   'for everyone'
  );
console.log('\n -- \n', use, '\n -- ');
console.log(result);

console.log(parth.cache);
