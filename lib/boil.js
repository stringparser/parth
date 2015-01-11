'use strict';

var util = require('./util');
util.fold = require('./fold');

exports = module.exports = boil;

// ## boil(p [, o]) -> path, options
// > normalize a path
//
// arguments
//  - `p` type `string` or `array`
//  - `o` type `object` holding all extra information
//
// return
//  - `null` for non supported `p` types
//  - `o.argv` array with the normalized path
// --
// api.private
// --

util.boilRE = /((?:\/)[^\/ ]+|[^\. ]+\.)/g;
util.stripUrlRE = /(?:\/)?[?#]+[^: ]+$|\/$/g;

function boil(p, o){
  o = o || { };
  o.path = util.fold(p);
  if(!o.path){ return null; }

  // save url so it can be parsed; trim it afterwards
  if((o.url = o.path.match(/\/\S*/))){
    o.url = o.url[0];
    o.path = o.path.replace(o.url,
      o.url.replace(util.stripUrlRE, '') || '/');
  }

  // depth, so it can be classified
  o.argv = o.argv || 
    o.path.replace(util.boilRE, '$& ').trim().split(/[ ]+/);

  return o.argv;
}
