'use strict';

var util = require('./lib/util');
util.boil = require('./lib/boil');

exports = module.exports = Parth;

function Parth(){
  if(!(this instanceof Parth)){ return new Parth(); }
  this.cache = {
    paths: Object.create(null),
    regex: Object.create(null),
    masterRE: Object.create(null)
  };
  this.cache.masterRE._ = [ ];
}

// ## Parth.set
// > premise: set a string, array path or regexp path (pending)
// > TODO: implement regexp input
//
// arguments
//  - `path` type `string` or `array`
//  - `o` type `object` optional holding all extra information
//
// return `this`
//

util.paramRE = /(^|\W)\:([^?#.(\/\\ ]+)(\(.+?\))?/g;

Parth.prototype.set = function(path, o){
  o = o || { }; o.notFound = !util.boil(path, o);
  if(o.notFound){ return null; }

  var cache = this.cache;
  o.found = cache.paths[o.depth]; // already defined
  if(o.found && (o.index = o.found.indexOf(o.path)) > -1){
    o.regex = o.found[o.index]; // provide the regexp
    return this;
  }

  if(!cache.paths[o.depth]){
    cache.paths[o.depth] = [ ];
    cache.regex[o.depth] = [ ];
  }

  o.regex = '^' + o.path.replace(/\S+/g, function(stem){
      o.sep = (/\//).test(stem) ? '/#?' : '.';
      return stem.replace(util.paramRE, function($0, $1, $2, $3){
        return $1 + ($3 || '([^' + o.sep + '^]+)');
      });
    }).replace(/[\/\.]/g, '\\$&')
      .replace(/\/\S+/, '$&\\/?')
      .replace(/\^\]\+/g, ' ]+');

  o.method = 'push';
  if(/\(.+?\)/.test(o.path)){ o.method = 'unshift'; }

  // update depths
  if(!cache.masterRE[o.depth]){
    cache.masterRE.length = cache.masterRE._.push(o.depth);
    cache.masterRE._ = cache.masterRE._.sort();
  }

  cache.paths[o.depth][o.method](o.path);
  cache.regex[o.depth][o.method](new RegExp(o.regex, 'i'));

  cache.masterRE[o.depth] =
    new RegExp(cache.regex[o.depth]
      .map(function(re){ return re.source; }).join('|')
      .replace(/[\(\)]+/g,''), 'i');

  return this;
};


// ## Parth.get
// > premise: get a string or array path, return an object
//
// arguments
//  - `path` type `string` or `array`
//  - `o` type `object` optional holding all extra information
//
// return `o`
//
Parth.prototype.get = function(path, o){
  o = o || { };
  o.notFound = !util.boil(path, o); // start as not found
  if(o.notFound){ return null; }

  o.found = this.cache.masterRE;
  o.index = o.depth = o.found.length;

  while(o.index){
    o.index = o.found._[--o.depth];
    if(o.index && o.found[o.index].test(o.path)){
      o.depth = o.index; o.found = o.path; o.index = null;
    }
  }
  if(o.index !== null){ return null; }

  o.index = 0;  o.regex = this.cache.regex[o.depth];
  while(!o.regex[o.index].test(o.path)){ o.index++; }

  o.regex = o.regex[o.index];
  o.path = this.cache.paths[o.depth][o.index];
  o.params = { _: o.found.match(o.regex).slice(1) };

  o.notFound = !(/[ ]+/).test(
    o.found.replace(
      o.path.replace(util.paramRE, function($0, $1, $2){
        var p = o.params._[o.index];
        o.params[$2] = o.params._[o.index++] = Number(p) || p;
        return $1 + p;
      }), '')[0] || ' ');

  delete o.depth; delete o.index; delete o.found;
  return o;
};
