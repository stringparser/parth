'use strict';

var input, path, regex, extra;
var parth = require('./.')();

// #set
input = [
  'obj.path.here', 'obj.path.:here(\\w+)',
  'obj.:path(\\d+).:here(\\w+)', ':obj.:path(\\w+).:here(\\d+)',
  'get /page/view', 'get /:page(\\w+(?:end))/view', ':method(get|post) /:page/:view',
];

console.log('\n -- parth.set -- \n');
input.forEach(function(stem, index){
  extra = { }; regex = parth.set(stem, extra);
  console.log(' input=', stem);
  console.log(' regex=', regex); console.log('');
  console.log(' extra=', extra);
  console.log((input[index+1] ? '\n -- \n' : ''));
});

// #get
input = [
  'obj.path.10', 'obj.10.prop', 'obj.10.10', 'array.method.prop',
  'get /weekend/view?query', 'get /user/view/#hash', 'post /user/page/?query=name&path=tree#hash'
];

console.log('\n -- parth.get -- ');
input.forEach(function(stem, index){
  extra = { }; regex = parth.get(stem, extra);
  console.log(' input=', stem);
  console.log(' regex=', regex); console.log('');
  console.log(' extra=', extra);
  console.log((input[index+1] ? '\n -- \n' : '\n -- '));
});

// #store
console.log(' parth.store=', parth.store);
