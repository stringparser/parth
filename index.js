'use strict';

var util = require('./lib/util');
util.fold = require('./lib/fold');

exports = module.exports = Parth;

function Parth(){

  if(!(this instanceof Parth)){ return new Parth(); }
  this.cache = { paths: [ ], regexp: [ ], masterRE: [ ]  };
}

// ## Parth.boil(path [, o])
// > premise: normalize a path, obtain its depth so one can classify it
//
// arguments
//  - `path` type `string` or `array`
//  - `o` type `object` holding all extra information
//
// return
//  - `this` so the method is chainable
//

util.boilRE = /((?:\/|\?|\#)[^\/\?\# ]+|[^\. ]+\.)/g;

Parth.prototype.boil = function (path, o){
  o = o || { };  var stem = util.type(path);
  if(!stem.string && !stem.array){ return null; }

  o.input = (stem.string || util.fold(stem.array.join(' ')));
  o.path = o.input.replace(/[ ]+/g, ' ');
  o.stems = '';

  var url;
  if((url = o.path.match(/\/\S+/))){
    o.url = util.url.parse(url = url[0]);
    o.url = {
      href: url,
      hash: o.url.hash,
      query: o.url.query,
      pathname: url.replace(
        (o.url.search || '') + (o.url.hash || ''), '')
        .replace(/\/+$/, ''),
    };
    o.path = o.path.replace(o.url.href, o.url.pathname || '/');
  }

  o.stems = o.path.replace(util.boilRE, '$& ').trim().split(/[ ]+/);
  o.index = o.depth = o.stems.length-1;
  return o.stems;
};

// ## Parth.set
// > premise: set a string, array path or regexp path
// > TODO: implement regexp input, not done yet :D
//
// arguments
//  - `path` type `string` or `array`
//  - `o` type `object` optional holding all extra information
//
// return
//  - `this` so the method is chainable
//

util.paramRE = /\:([^\/\\\?\#\.\( ]+)(\(.+?\))?/g;

Parth.prototype.set = function(path, o){
  this.boil(path, (o = o || { }));

  o.found = this.cache.paths[o.depth];
  if(o.found && (o.index = o.found.indexOf(o.path)) > -1){
    o.regexp = o.found[o.index];
    return this;
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
      return stem.replace(util.paramRE, function($0, $1, $2){
        o.params = o.params || { };
        o.params[$1] = $2 || '([^' + o.sep + '^]+)';
        return ':' + $1;
      });
    }).replace(/[\/\.\?\#]+/g, '\\$&')
      .replace(util.paramRE, function($0, $1){ return o.params[$1]; });

  if(o.url && o.url.pathname.length > 1){
    o.regexp = o.regexp.replace(/\/\S+/, '$&\\/?');
  }
  o.regexp = o.regexp.replace(/\^\]\+/g, ' ]+');
  o.regexp = new RegExp('^' + o.regexp, o.strict ? '' : 'i');
  o.method = (/\(.+?\)/).test(o.path) ? 'unshift' : 'push';

  cache.paths[o.depth][o.method](o.path);
  cache.regexp[o.depth][o.method](o.regexp);
  cache.masterRE[o.depth] = new RegExp(cache.regexp[o.depth]
    .map(function(re){
      return re.source.replace(/[\(\)]+/g,''); }).join('|'), 'i');

  return this;
};


// ## Parth.get
// > premise: get a string or array path, return an object
//
// arguments
//  - `path` type `string` or `array`
//  - `o` type `object` optional holding all extra information
//
// return
//  - `o` type `object`
//
Parth.prototype.get = function(path, o){
  this.boil(path, (o = o || { }));

  var cache = this.cache;
  o.found = cache.masterRE;
  if(o.depth > o.found.length-1){ o.index = o.depth = o.found.length-1; }

  while(o.index > -1){
    if(o.found[o.index] && o.found[o.index].test(o.path)){
      o.depth = o.index; o.index = 0;
    } else if(!o.index){ o.depth = null; }
    o.index--;
  }
  if(o.depth === null){ return null; }

  o.index = 0;
  o.regexp = cache.regexp[o.depth];
  while(!o.regexp[o.index].test(o.path)){ o.index++; }
  o.found = o.path;
  o.path = cache.paths[o.depth][o.index];
  o.regexp = cache.regexp[o.depth][o.index];

  o.index = 0;
  o.notFound = false; o.params = {};
  var params = o.found.match(o.regexp).slice(1);
  o.notFound = !(/[ ]+/).test(
      o.found.replace(
          o.path.replace(util.paramRE, function($0, $1){
            var par = params[o.index++];
            return (o.params[$1] = Number(par) || par);
          }), '')[0] || ' ');

  params = null; delete o.index; delete o.found; // wipe

  return o;
};
