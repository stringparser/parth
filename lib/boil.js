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

util.urlRE = /\/?[?#][^!=:][^ ]+/g;
util.boilRE = /([^\/ ]*\/[^\/ ]*|[^\. ]+\.)/g;

function boil(path, o){
  if(typeof path !== 'string'){
    throw new TypeError('argument should be a  `string`');
  }

  o = o || {};
  o.url = (path.match(/[^\/ ]*\/\S*/g) || '')[0];
  o.path = path.replace(/[ ]+/g, ' ').trim();

  if(o.url){
    o.path = o.path.replace(o.url, o.url.replace(util.urlRE, '') || '/');
  }

  o.argv = o.path.replace(util.boilRE, '$& ').trim().split(/[ ]+/);

  return o;
}
