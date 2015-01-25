'use strict';

var util = require('./util');
util.fold = require('./fold');

exports = module.exports = boil;

// ## boil(path [, opt])
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

util.boilRE = /([^\/ ]*\/[^\/ ]*|[^\. ]+\.)/g;
util.stripUrlRE = /(?:\/)?[?#]+[^: ]+$|\/$/g;

function boil(path, o){
  if(typeof path !== 'string'){ return null; }

  o = o || { };
  o.url = path.match(/[^\/ ]*\/\S+/g) || [];
  o.path = util.fold(path.replace(/[ ]{2,}/g, ' ').trim());

  // save url so it can be parsed
  o.url.forEach(function(url){
    o.path = o.path.replace(url,
      url.replace(util.stripUrlRE, '') || '/');
  });

  if(o.url.length < 2){
    o.url = o.url[0] || null;
  }

  o.argv = o.path.replace(util.boilRE, '$& ')
    .trim().split(/[ ]+/);

  return o.argv;
}
