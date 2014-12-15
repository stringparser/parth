'use strict';

var util = require('./util');
util.fold = require('./fold');

exports = module.exports = boil;

// ## boil(path [, o])
// > premise: normalize a path, obtain its depth so one can classify it
//
// arguments
//  - `path` type `string` or `array`
//  - `o` type `object` holding all extra information
//
// return
//  `o.argv` array with the normalized path as a vector
//

util.boilRE = /((?:\/|\?|\#)[^\/\?\# ]+|[^\. ]+\.)/g;

function boil(path, o){
  if(!path){ return null; }
  path = util.type(path); o = o || { };
  if(!path.match(/string|array/)){ return null; }
  o.input = util.fold(path.string || path.array.join(' '));
  o.path = o.input.replace(/[ ]+/g, ' ').trim();

  if((o.url = o.path.match(/\/\S+/))){
    o.url = util.url.parse(o.url[0]);
    o.url.pathname = o.url.pathname.replace(/\/+$/, '') || '/';
    o.path = o.path.replace(o.url.href, o.url.pathname);
    delete o.url;
  }

  o.argv = o.path.replace(util.boilRE, '$& ').trim().split(/[ ]+/);
  o.index = o.depth = o.argv.length;
  return o.argv;
}
