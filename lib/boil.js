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

var urlRE = /\/?[?#][^!=:][^ ]+/g;
var boilRE = /([^\/ ]*\/[^\/ ]*|[^\. ]+\.)/g;

function boil(path, o){
  if(typeof path !== 'string'){
    throw new TypeError('first argument should be a `string`');
  }

  o = util.type(o).object || {};
  o.match = o.path = path.replace(/[ ]{2,}/g, ' ').trim();
  o.url = o.path.match(/[^\/ ]*\/\S*/g);

  if(o.url){
    o.url = o.url[0];
    o.path = o.path.replace(o.url, o.url.replace(urlRE, '') || '/');
  }

  o.argv = o.path.replace(boilRE, '$& ').trim().split(/[ ]+/);
  o.depth = o.argv.length;
  return o;
}
