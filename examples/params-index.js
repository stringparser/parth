'use strict';

var poketh = require('../');

var input = '/blog/:view/:partial/:test?/';
var result = poketh(input);
console.log('\n -- \n');
console.log(result);
console.log('\n -- \n');
console.log(result.parse(['one', 'two', 'Three']));


var input = '/blog/:view/:partial?:query';
var result = poketh(input);
console.log('\n -- \n');
console.log(result);
console.log('\n -- \n');
console.log(result.parse('/one/two/three-four/some=stuff&more=things', { index : 1}));
