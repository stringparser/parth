'use strict';

var util = require('./lib/util');
util.fold = require('./lib/fold');
util.boil = require('./lib/boil');

exports = module.exports = Parth;

function Parth(){
  if(!(this instanceof Parth)){ return new Parth(); }
  this.cache = { paths: [ ], regexp: [ ], masterRE: [ ]  };
}

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

util.paramRE = /(^|\W)\:([^?#.(\/\\ ]+)(\(.+?\))?/g;

Parth.prototype.set = function(path, o){
  var wipe = !o; util.boil(path, (o = o || { }));

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
      o.sep = (/\//).test(stem) ? '/#?' : '.';
      return stem.replace(util.paramRE, function($0, $1, $2, $3){
        return $1 + ($3 || '([^' + o.sep + '^]+)');
      });
    }).replace(/[\/\.]/g, '\\$&');

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

  if(wipe){ wipe = o = null; }
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
  util.boil(path, (o = o || { }));

  var cache = this.cache;
  o.found = cache.masterRE;
  if(o.depth > o.found.length-1){ o.index = o.depth = o.found.length-1; }

  while(o.index > -1){
    if(o.found[o.index] && o.found[o.index].test(o.path)){
      o.depth = o.index; o.index = 0; o.found = o.path;
    } else if(!o.index){
      o.depth = null; o.notFound = true;
      return null;
    }
    o.index--;
  }

  o.index = 0; o.regexp = cache.regexp[o.depth];
  while(!o.regexp[o.index].test(o.path)){ o.index++; }
  o.path = cache.paths[o.depth][o.index];
  o.regexp = cache.regexp[o.depth][o.index];

  o.params = { };
  var params = o.found.match(o.regexp).slice(1);
  o.notFound = !(/[ ]+/).test(
    o.found.replace(
      o.path.replace(util.paramRE, function($0, $1, $2){
        var p = params[o.index++];
        return $1 + (o.params[$2] = Number(p) || p);
      }), '')[0] || ' ');

  params = null; delete o.index;
  return o;
};
