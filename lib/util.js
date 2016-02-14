'use strict';

exports = module.exports = { };

// dependencies
//
exports.clone = require('lodash.clone');
exports.merge = require('lodash.merge');
exports.escapeRegExp = require('lodash.escaperegexp');

/**
# boil(string path [, object options])
> path normalizer

arguments
- path, type `string`
- options, type `object` holding all extra information

returns
- null for non supported types
- an object with path and url props only

if the `o` object given had a not found prop
**/

var qsRE = /\/?[?#][^!=:][^ ]+/g;

exports.boil = function boil(path, o){
  if(typeof path !== 'string'){ return null; }

  o = o || {};
  o.path = path.replace(/[ ]+/, ' ').trim();
  var url = o.path.match(/[^\/ ]*\/\S*/g);

  if(url){
    url = url[0];
    o.path = o.path.replace(url, url.replace(qsRE, '') || '/');
    if(o.notFound){ o.url = url; }
  }

  return o;
};

/**
# voidRE(regex)
> void all groups in a regular expression
 arguments
  - regex

 returns
  - regular expression
**/
exports.voidRE = function voidRE(o){
  return RegExp(o.regex).source.replace(/\((?=[^?])/g, '(?:');
};
