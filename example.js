'use strict';

var input, regex, extra;
var parth = require('./.')();

// #set
input = [
  '/',
  'page',
  ':page',
  ':page(\\w+)',
  'get page',
  'get :page',
  'get :page(\\w+)',
  ':get :page',
  ':get(\\w+) :page',
  ':get(\\w+) :page(\\w+)',
  'get page thing',
  'get page view',
  ':get page view',
  ':get :page view',
  ':get :page :view',
  ':get(\\S+) page view',
  ':get(\\S+) :page(\\S+) view',
  ':get(\\S+) :page(\\S+) :view',
  ':get(\\S+) :page(\\S+) :view(\\S+)',
].sort(function(){
  return Math.random()*Math.pow(-1, Math.floor(Math.random()*10));
});

console.log('\n -- parth.add -- ');
input.forEach(function(stem, index){
  extra = { }; regex = parth.add(stem, extra);
  console.log(' input =', stem);
  console.log('return =', regex);
  console.log((input[index+1] ? ' -- ' : ''));
});

console.log(input);

// // #get
// input = [
//   '1', '2', '1 2',
//   'obj.path.10',
//   'obj.10.prop',
//   'obj.10.10',
//   'array.method.prop',
//   'get /weekend/baby?query=string#hash user.10.beers now',
//   'get /user/view/#hash',
//   'post /user/page/photo?query=name&path=tree#hash'
// ];
//
// console.log(' -- parth.match -- ');
// input.forEach(function(stem, index){
//   extra = { }; regex = parth.match(stem, extra);
//   console.log(' input =', stem);
//   console.log('return =', regex);
//   console.log(' extra =', extra);
//   console.log((input[index+1] ? ' -- ' : '' ));
// });
//
// Object.keys(parth.regex).forEach(function(prop){
//   var print = parth.regex[prop];
//   if(prop === 'master'){
//     if(process.argv.indexOf('-l') < 0){ return ; }
//     print = print.source.split(/\|(?=\({1,2})/);
//   }
//   console.log('parth.regex[%s]', prop);
//   console.log(print);
//   console.log(' --\n');
// });

var master = [];
parth.regex.forEach(function(origin){
  master.push.apply(master, origin);
});

function modulus(x, y){
  if(x.depth !== y.depth){
    return y.depth - x.depth;
  }
  var distance = 2*x.def + x.cus - (2*y.def + y.cus);
  return distance || (y.source.length - x.source.length);
}

master.sort(modulus);

console.log(master);
