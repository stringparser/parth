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
var boilRE = /(\/[^\/ ]+|\.[^\.\/ ]+)/g;

function boil(path, o){
  o = o || {};
  o.path = path.replace(/[ ]+/, ' ').trim();
  o.url = o.path.match(/[^\/ ]*\/\S*/g);

  if(o.url){
    o.url = o.url[0];
    o.path = o.path.replace(o.url, o.url.replace(urlRE, '') || '/');
  }

  if(!o.notFound){
    o.depth = boil.argv(o.path).length;
  }

  return o;
}

// separated for paths that were already boiled before
//
boil.argv = function(path){
  return path.replace(boilRE, ' $&').trim().split(/[ ]+/);
};
