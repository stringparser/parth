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
  p = util.type(p);
  if(!p.match(/string|array/)){ return null; }

  o = o || { };
  o.path = util.fold(p.string || p.array.join(' '))
    .replace(/[ ]+/g, ' ').trim();

  // save url so it can be parsed; trim it afterwards
  if((o.url = o.path.match(/\/\S*/))){
    o.url = o.url[0];
    o.path = o.path.replace(o.url,
      o.url.replace(util.stripUrlRE, '') || '/');
  }

  // Parth.get does not need depth
  if(o.notFound){ return true; } // -> all good

  // depth, so it can be classified
  o.argv = o.path.replace(util.boilRE, '$& ').trim().split(/[ ]+/);
  o.depth = o.argv.length;
  return o.argv;
}
