'use strict';

var util = require('./lib/util');

exports = module.exports = Parth;

function Parth(){

  if(!(this instanceof Parth)){ return new Parth(); }
  this.cache = { paths: [ ], regexp: [ ], masterRE: [ ]  };
}

// ## Parth.boil
// > premise: obtain a "normalized" array
//
// arguments
//  - `stem` type `string` or `array`
//  - `o` type `object` optional, will contain all extra information
//
// return
//  - `this` so the method is chainable
//
var boilRE = /((?:\/|\?|\#)[^\/\?\# ]+|[^\. ]+\.)/g;
Parth.prototype.boil = function (stem, o){
  var s = util.type(stem);
  if(!s.string && !s.array){ return null; }

  o = o || { };
  o.input = (s.string || util.fold(s.array.join(' ')));
  o.path = o.input.replace(/[ ]+/g, ' ');
  o.stems = '';

  var url;
  if((url = o.path.match(/\/\S+/))){
    o.url = util.url.parse(url = url[0]);
    o.url = {
      href: url,
      hash: o.url.hash,
      query: o.url.query,
      pathname: url.replace(o.url.search + o.url.hash, '')
    };
    o.path = o.path.replace(
      o.url.href, o.url.pathname.replace(/[\/]+$/, '') || '/');
  }

  o.stems = o.path.replace(boilRE, '$& ').trim().split(/[ ]+/);
  o.index = o.depth = o.stems.length-1;
  return o.stems;
};

// ## Parth.set
// > premise: set a string or array path (regexp pending)
//
// arguments
//  - `path` type `string` or `array`
//  - `opt` type `object` optional
//
// return
//  - `this` so the method is chainable
//
Parth.prototype.set = function(path, o){
  this.boil(path, (o = o || { }));

  o.found = this.cache.paths[o.depth];
  if(o.found && o.found.indexOf(o.path) > -1){
    o = null; return this;
  }

  var cache = this.cache;
  // prepare paths, regexp and masterRE arrays
  if(cache.regexp.length < o.depth + 1){
    o.index = cache.regexp.length;
    while(o.index < o.depth + 1){
      cache.paths.push([ ]);
      cache.regexp.push([ ]);
      o.index = cache.masterRE.push(null);
    }
  }

  o.regexp = o.path
    .replace(/\S+/g, function(stem){
      o.sep = (/\//).test(stem) ? '\\/\\#\\?' : '\\.';
      return stem.replace(/(\:\w+)(\(.+?\))?/g, function($0, $1, $2){
        o.params = o.params || { };
        o.params[$1] = $2 || '([^' + o.sep + '^]+)';
        return $1;
      });
    }).replace(/[\/\.\?\#]+/g, '\\$&')
      .replace(/\:\w+/g, function($0){ return o.params[$0]; });

  if(o.url && o.url.pathname.length > 1){
    o.regexp = o.regexp.replace(/\/\S+/, '$&\\/?');
  }
  o.regexp = o.regexp.replace(/\^\]\+/g, ' ]+');
  o.regexp = new RegExp('^' + o.regexp, o.strict ? '' : 'i');
  o.method = (/\(.+?\)/).test(o.path) ? 'unshift' : 'push';

  cache.paths[o.depth][o.method](o.path);
  cache.regexp[o.depth][o.method](o.regexp);

  cache.masterRE[o.depth] = new RegExp(cache.regexp[o.depth]
    .map(function(regex){ return regex.source; }).join('|'), 'i');

  return this;
};


// ## Parth.get
// > premise: get a string or array path
//
// arguments
//  - `path` type `string` or `array`
//  - `opt` type `object` optional
//
// return
//  - `output` type `object` with useful propeties
//
Parth.prototype.get = function(path, o){
  this.boil(path, (o = o || { }));

  var cache = this.cache, found = cache.masterRE;

  if(o.index > found.length-1){
    o.index = o.depth = found.length-1;
  }

  while(o.index > -1){
    if(found[o.index] && found[o.index].test(o.path)){
      o.depth = o.index; o.index = -1;
    } else if(!o.index){ o.depth = null; }
    o.index--;
  }

  if(o.depth === null){
    return null;
  }

  o.index = 0;
  o.regexp = cache.regexp[o.depth];
  while(!o.regexp[o.index].test(o.path)){ o.index++; }
  o.stems = cache.paths[o.depth][o.index];
  o.regexp = cache.regexp[o.depth][o.index];

  o.index = 0;
  o.notFound = false; o.params = {};
  var param = o.path.match(o.regexp).slice(1);

  o.notFound =
    !(/[ \.]+/).test(
      o.path.replace(
          o.stems.replace(/\:(\w+)(\(.+?\))?/g, function($0, $1){
            return (o.params[$1] = param[o.index++]);
          }), '')[0] || ' ');

  // wipe
  param = null; delete o.index; delete o.depth;
  return o;
};
