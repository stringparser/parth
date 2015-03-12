'use strict';

var util = require('./util');

exports = module.exports = boil;

// ## boil(path [, options])
// > normalize a path
//
// arguments
//  - path, type `string`
//  - options, type `object` holding all extra information
//
// throws error if the `path` is not supported
//
// --
// api.private
// --

util.boilRE = /([^\/ ]*\/[^\/ ]*|[^\. ]+\.)/g;
util.noUrlRE = /(?:\/)?[?#]+[^: ]+$|\/$/g;

function boil(path, o){
  if(typeof path !== 'string'){
    throw new TypeError('argument should be a  `string`');
  }

  o = o || {};

  o.url = (path.match(/[^\/ ]*\/\S+/g) || ' ')[0];
  o.path = path.replace(/[ ]+/g, ' ')
    .replace(o.url, o.url.replace(util.noUrlRE, '') || '/').trim();
  o.argv = o.path.replace(util.boilRE, '$& ').trim().split(/[ ]+/);

  return o;
}
