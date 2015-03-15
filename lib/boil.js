'use strict';

exports = module.exports = boil;

// ## boil(path [, options])
// > normalize a path
//
// arguments
//  - path, type `string`
//  - options, type `object` holding all extra information
//
// returns
//  - true for supported and non-empty types
//  - null for non supported types
//
// --
// api.private
// --

var urlRE = /\/?[?#][^!=:][^ ]+/g;
var boilRE = /([^\/ ]*\/[^\/ ]*|[^\. ]+\.)/g;

function boil(path, o){
  if(typeof path !== 'string'){ return null; }

  o = o || {};
  o.path = path.replace(/[ ]{2,}/g, ' ').trim();
  if(!o.path){ return null; }
  var url = o.path.match(/[^\/ ]*\/\S*/g);

  if(url){
    url = url[0];
    o.path = o.path.replace(url, url.replace(urlRE, '') || '/');
    if(o.notFound){ o.url = url; }
  }

  var argv = o.path.replace(boilRE, '$& ').trim().split(/[ ]+/);
  o.depth = argv.length;
  return argv;
}
