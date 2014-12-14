'use strict';

var util = require('./util');

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
  o = o || { };
  var stem = util.type(path);
  if(!stem.string && !stem.array){ return null; }

  o.input = (stem.string || util.fold(stem.array.join(' ')));
  o.path = o.input.replace(/[ ]+/g, ' ').trim();

  var url;
  if((url = o.path.match(/\/\S+/))){
    o.url = util.url.parse(url = url[0]);
    o.url = {
      href: url,
      hash: o.url.hash,
      query: o.url.search,
      pathname: o.url.pathname.replace(/\/+$/, '') || '/',
    };
    o.path = o.path.replace(url, o.url.pathname);
  }

  o.argv = o.path.replace(util.boilRE, '$& ').trim().split(/[ ]+/);
  o.index = o.depth = o.argv.length-1;
  return o.argv;
}
