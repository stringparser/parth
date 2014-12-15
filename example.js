'use strict';

var set, input, got, op = { };
var parth = require('./.')();

set = 'hello.:there(\\w+).:you';
input = 'hello.awesome.human';
got = parth.set(set).get(input);
console.log('\n set = %s \n input = %s \n got =>\n', set, input);
console.log(got);

set = '/hello/:there/:you(\\w+)';
input = '/hello/awesome/human/?you=matter';
got = parth.set(set).get(input);
console.log('\n set = %s \n input = %s \n got =>\n', set, input);
console.log(got);

parth
  .set(':number(\\d+) paths on fire')
  .get('my paths on fire', op);
// => null
console.log('\n op \n', op);

//
// lets get serious <:)
//

set = ':method(get|put|delete|post) :model.data /hello/:one/:two?something';
input = 'get page.data /hello/there/awesome.json?page=10';
got = parth.set(set).get(input);
console.log('\n set = %s \n input = %s \n got =>\n', set, input);
console.log(got);

parth.set('/');
parth.set('get /');
parth.set('get /url/:with');
parth.set('get /url/:with/data/');
parth.set('get /:page(\\d+)/:with/data/');
parth.set('get /:page(\\d+)/:with/data/?some=query#hash something.:here');
parth.set('get page.:model /:page/:url(\\w+)/with.json/');

input = 'get /url';
got = parth.get(input, op);
console.log('\n input = %s \n got =>\n', input, op.notFound);
console.log(got ? got : op);

input = 'get /url/page';
got = parth.get(input, op);
console.log('\n input = %s \n got =>\n', input, op.notFound);
console.log(got ? got : op);

input = 'get /10/page/data#hash';
got = parth.get(input, op);
console.log('\n input = %s \n got =>\n', input, op.notFound);
console.log(got ? got : op);

console.log('\n - parth.cache \n'); console.log(parth.cache);
