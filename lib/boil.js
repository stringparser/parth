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
//  - `this` so the method is chainable
//

util.boilRE = /((?:\/|\?|\#)[^\/\?\# ]+|[^\. ]+\.)/g;

function boil(path, o){
  var stem = util.type(path);
  if(!stem.string && !stem.array){ return (wipe = null); }
  var wipe = !o; o = o || { };

  o.input = (stem.string || util.fold(stem.array.join(' ')));
  o.path = o.input.replace(/[ ]+/g, ' ');
  o.argv = '';

  var url;
  if((url = o.path.match(/\/\S+/))){
    o.url = util.url.parse(url = url[0]);
    o.url = {
      href: url,
      hash: o.url.hash,
      query: o.url.query,
      pathname: url.replace(
        (o.url.search || '') + (o.url.hash || ''), '')
        .replace(/\/+$/, '') || '/',
    };
    o.path = o.path.replace(o.url.href, o.url.pathname);
  }

  var stems = o.path.replace(util.boilRE, '$& ').trim().split(/[ ]+/);
  o.index = o.depth = stems.length-1;
  if(wipe){ wipe = o = null; }
  return stems;
}
