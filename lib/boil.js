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
  o.path = path.trim();
  if(!o.path){ return null; }
  var url = o.path.match(/[^\/ ]*\/\S*/g);

  if(url){
    o.url = url = url[0];
    o.path = o.path.replace(url, url.replace(urlRE, '') || '/');
  }

  return o;
}

// separated for paths that were already boiled before
//
boil.argv = function(path){
  return path.replace(boilRE, '$& ').trim().split(/[ ]+/);
};
