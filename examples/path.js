'use strict';

var poke = require('../');
var use, pattern, args, result;

use = 'object paths';
pattern = 'hello.:there.:you';
args = 'awesome';
result = poke(pattern, args);
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'unix paths';
pattern = '/hello/:there/:you';
args = ['awesome','human/should'];
result = poke(pattern, args);
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'url paths';
pattern = '/hello/:there/:you/?:query';
args = '/awesome/human?you=matter';
result = poke(pattern, args);
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'windows paths';
pattern = '\\hello\\:there\\:you';
args = ['awesome', 'human'];
result = poke(pattern, args);
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'sentences';
pattern = 'you are an :there :you';
args = (function(){ return arguments; })('awesome', 'human');
result = poke(pattern, args);
console.log('\n ', use, '\n -- ');
console.log(result);

use = 'be specific';
pattern = '/hello/:one/:two?:three';
args = {one : 'there', two : 'impecable', three : 'human=being'};
result = poke(pattern, args);
console.log('\n -- \n', use, '\n -- ');
console.log(result);

use = 'compose';
args = ['kick', 'ass', 'human'];
pattern = 'hey :there:you :person';
result = poke(pattern, args);
console.log('\n -- \n', use, '\n -- ');
console.log(result);
