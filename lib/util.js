'use strict';

exports = module.exports = { };

// dependencies
//
exports.escapeRegExp = require('lodash.escaperegexp');

// assorted utilities below
//

// ## boil(path [, options])
// > path normalizer
//
// arguments
//  - path, type `string`
//  - options, type `object` holding all extra information
//
// returns
//  - null for non supported types
//  - an object with path and url props only
//    if the `o` object given had a not found prop
//

var urlRE = /\/?[?#][^!=:][^ ]+/g;
var boilRE = /([/.][(:\w])/g;

exports.boil = function boil(path, o){
  if(typeof path !== 'string'){ return null; }

  o = o || {};
  o.path = path.replace(/[ ]+/, ' ').trim();
  var url = o.path.match(/[^\/ ]*\/\S*/g);

  if(url){
    url = url[0];
    o.path = o.path.replace(url, url.replace(urlRE, '') || '/');
    if(o.notFound){ o.url = url; }
  }

  return o;
};

// separated for paths that were already boiled before
//
exports.boil.argv = function(path){
  return path.replace(boilRE, ' $&').trim().split(/[ ]+/);
};

// ## voidRE(regex)
// > void all groups in a regular expression
//
// arguments
//  - regex
//
// returns
//  - regular expression
//
exports.voidRE = function voidRE(regex){
  return RegExp(regex).source.replace(/\((?=[^?])/g, '(?:');
};
// NOTE: the RegExp constructor seems to invoke toString of the given
// argument not throwing error for any input.
//
