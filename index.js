'use strict';

var util = require('./lib/util');
util.fold = require('./lib/fold');

exports = module.exports = Parth;

function Parth(){
  if(!(this instanceof Parth)){ return new Parth(); }
  this.cache = {
    _ : Object.create(null),
    regex: Object.create(null),
    masterRE: Object.create(null),
  };
  this.cache.masterRE._ = [ ];
}

// ## Parth.boil(path [, o])
// > normalize a path
//
// arguments
//  - `path` type `string` or `array`
//  - `o` type `object` holding all extra information
//
// return
//  `o.argv` array with the normalized path
//

util.boilRE = /((?:\/)[^\/]+|[^\. ]+\.)/g;

Parth.prototype.boil = function (p, o){
  if(!p){ return null; } p = util.type(p);
  if(!p.match(/string|array/)){ return null; }
  o = o || { };

  o.path = o.input = util.fold(p.string || p.array.join(' '));
  o.path = o.path.replace(o.path, o.path
    .replace(/\/?[?#]+[^ ]+$|\/+$/g, '') || '/')
      .replace(/[ ]+/, ' ').trim();

  o.argv = o.path.replace(util.boilRE, '$& ').trim().split(/[ ]+/);
  o.depth = o.index = o.argv.length;
  return o.argv;
};

// ## Parth.set
// > take a string or array path and make it a regexp
// > TODO: implement regexp input
//
// arguments
//  - `path` type `string` or `array`
//  - `o` type `object` optional holding all extra information
//
// return `this`
//

util.paramRE = /(^|\W)\:([^()?#\.\/ ]+)(\(.+?\))?/g;

Parth.prototype.set = function(p, opt){
  var o = opt || { }; if(!this.boil(p, o)){ return this; }

  // already defined ?
  if(this.cache._[o.path]){ return this; }

  var cache = this.cache;
  o.custom = o.default = 0;
  o.regex = '^' + o.path.replace(/\S+/g, function(stem){
    o.sep = (/\//).test(stem) ? '/#?' : '.';
      return stem.replace(util.paramRE, function($0, $1, $2, $3){
        if($3){ o.custom++; }
         else { o.default++; }
        return $1 + ($3 || '([^' + o.sep + '^]+)');
      });
    }).replace(/[\/\.]/g, '\\$&')
      .replace(/\/\S+/, '$&\\/?')
      .replace(/\^\]\+/g, ' ]+');


  // update depths
  if(!cache.regex[o.depth]){
    cache.regex[o.depth] = [ ];
    cache.masterRE.depth = cache.masterRE._.push(o.depth)-1;
    cache.masterRE._ = cache.masterRE._.sort();
  }

  cache._[o.regex] = o.path;
  cache._[o.path] = o.regex;

  o.regex = new RegExp(o.regex, 'i');
  o.regex.def = o.default;
  o.regex.cust = o.custom;

  cache.regex[o.depth].push(o.regex);
  cache.regex[o.depth] = cache.regex[o.depth].sort(function(a, b){
    return (b.def - b.cust) - (a.def - a.cust);
  });

  cache.masterRE[o.depth] =
    new RegExp(cache.regex[o.depth]
      .map(function(re){ return re.source; }).join('|')
      .replace(/\((?=\?)/g, '(?:'), 'i');

  return this;
};


// ## Parth.get
// > take a string or array, return the matching path
//
// arguments
//  - `path` type `string` or `array`
//  - `o` type `object` optional holding all extra information
//
// return `o`
//
Parth.prototype.get = function(path, o){
  o = o || { }; o.notFound = true;
  if(!this.boil(path, o)){ return null; }
  if(o.cached){ return o; }

  o.found = this.cache.masterRE;
  if(o.depth > o.found.depth){ o.depth = o.found.depth; }
  //console.log('\n -- path = %s ; depth = %s -- \n', o.path, o.depth);

  while(o.index > -1){
    o.index = o.found._[o.depth];
    if(o.index === void 0){ return null; }
    if(o.found[o.index].test(o.path)){
      o.depth = o.index; o.found = o.path; o.index = -1;
    } else { o.depth--; }
  }

  o.regex = this.cache.regex[o.depth];
  o.index = o.regex.length-1;
  while(!o.regex[o.index].test(o.path)){ o.index--; }

  o.regex = o.regex[o.index];
  o.path = this.cache._[o.regex.source];
  o.params = { _: o.found.match(o.regex).slice(1) };

  o.index = 0;
  o.notFound = !(/[ ]+/).test(
    o.found.replace(
      o.path.replace(util.paramRE, function($0, $1, $2){
        var p = o.params._[o.index];
        o.params[$2] = o.params._[o.index++] = Number(p) || p;
        return $1 + p;
      }), '')[0] || ' ');

  if(o.params._.length){
    o.argv = o.path.replace(util.boilRE, '$& ').trim().split(/[ ]+/);
  }


  delete o.index; delete o.found;
  return o;
};
