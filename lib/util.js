'use strict';

exports = module.exports = { };

// dependencies
//
exports.clone = require('lodash.clone');
exports.merge = require('lodash.merge');

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

var qsRE = new RegExp([
  '\\/?', // urls can end with slash but is optional
  '[?#]', // start of querystring/hash
  '[^!=:]', // exclude ?!, ?= and ?: regex strings
  '[^ ]+'
].join(''), 'g');

exports.boil = function boil(path, o){
  if(typeof path !== 'string'){ return null; }

  o = o || {};
  o.path = path.replace(/[ ]+/, ' ').trim();
  var urls = o.path.match(/[^\/ ]*\/\S*/g) || [];

  urls.forEach(function(url){
    o.path = o.path.replace(url, url.replace(qsRE, '') || '/');
  });

  if(o.notFound){
    o.url = urls.length > 1 ? urls : urls[0];
    o.notFound = o.path;
  }

  return o;
};
