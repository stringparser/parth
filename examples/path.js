'use strict';

var parth = require('../')();

parth.set('/');
parth.set('get /');
parth.set('get /url/:with/data');
parth.set('get /:page(\\d+)/:with/data');
parth.set('get page.:model /:page/:url(\\w+)/with.json');

console.log('got', parth.get('/'));
