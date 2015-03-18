'use strict';

exports = module.exports = voidRE;

// ## voidRE(regex)
// > void all groups in a regular expression
//
// arguments
//  - regex
//
// returns
//  - regular expression
//
// --
// api.private
// --
// NOTE: the RegExp constructor seems to invoke toString of the given
// argument not throwing error for any input.
//
function voidRE(regex){
  return RegExp(regex).source.replace(/\((?=[^?])/g, '(?:');
}
