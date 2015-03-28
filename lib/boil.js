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
//
var boilRE = /([/.][(:\w])/g;
var urlRE = /\/?[?#][^!=:][^ ]+/g;

function boil(path, o){
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
}

// separated for paths that were already boiled before
//
boil.argv = function(path){
  return path.replace(boilRE, ' $&').trim().split(/[ ]+/);
};
