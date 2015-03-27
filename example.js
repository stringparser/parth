'use strict';

var input, regex, extra;
var parth = require('./.')();

// #set
input = [
  '1',
  '2',
  '1 2',
  'obj.path.here',
  'get /page/view',
  'obj.path.:here(\\w+)',
  'obj.:path(\\d+).:here(\\w+)',
  ':obj.:path(\\w+).:here(\\d+)',
  'get /:page(\\w+(?:end))/baby user.:data(\\d+).:drink :when',
  ':method(get|post) /:page/:view',
  '(get|post) /:page/:view',
];

console.log('\n -- parth.add -- ');
input.forEach(function(stem, index){
  extra = { }; regex = parth.add(stem, extra);
  console.log(' input =', stem);
  console.log('return =', regex);
  console.log((input[index+1] ? ' -- ' : ''));
});

// #get
input = [
  '1',
  '2',
  '1 2',
  'obj.path.10',
  'obj.10.prop',
  'obj.10.10',
  'array.method.prop',
  'get /weekend/baby?query=string#hash user.10.beers now',
  'get /user/view/#hash',
  'post /user/page/?query=name&path=tree#hash photo'
];

console.log(' -- parth.match -- ');
input.forEach(function(stem, index){
  extra = { }; regex = parth.match(stem, extra);
  console.log(' input =', stem);
  console.log('return =', regex);
  console.log(' extra =', extra);
  console.log((input[index+1] ? ' -- ' : '' ));
});

if(process.argv.indexOf('-l') < 0){ return ; }
Object.keys(parth).forEach(function(prop){
  console.log(parth[prop]);
  console.log(' --\n');
});

parth.regex.forEach(function(re){
  console.log(re.path);
});
