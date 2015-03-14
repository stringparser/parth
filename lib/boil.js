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
  o.path = path.replace(/[ ]{2,}/g, ' ').trim();
  var url = o.path.match(/[^\/ ]*\/\S*/g);

  if(url){
    url = url[0];
    o.path = o.path.replace(url, url.replace(urlRE, '') || '/');
    if(o.notFound){ o.url = url; }
  }

  o.depth = o.path.replace(boilRE, '$& ').trim().split(/[ ]+/).length;
  return o;
}
