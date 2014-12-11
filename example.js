'use strict';

var parth = require('./.')();

parth.set('/');
parth.set('get /');
parth.set('get /url/:with/data/');
parth.set('get /:page(\\d+)/:with/data/ something.:here');
parth.set('get /:page(\\d+)/:with/data/?some=query#hash something.:here');
parth.set('get page.:model /:page/:url(\\w+)/with.json/');

console.log('got ');
console.log(parth.get('get /url'));
console.log('got ');
console.log(parth.get('get /url/page'));
console.log('got ');
console.log(parth.get('get /10/page/data/?some=query#hash something.else'));

console.log(parth.cache);
