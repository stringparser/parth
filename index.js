'use strict';

var util = require('./lib/util');
util.fold = require('./lib/fold');

exports = module.exports = Parth;

function Parth(){
  if(!(this instanceof Parth)){ return new Parth(); }
  this.cache = {
    paths: [ ],
    regex: [ ],
    masterRE: Object.create(null)
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

util.boilRE = /((?:\/|\?|\#)[^\/\?\# ]+|[^\. ]+\.)/g;

Parth.prototype.boil = function (p, opt){
  if(!p){ return null; } p = util.type(p);
  if(!p.match(/string|array/)){ return null; }

  var o = opt || { };
  o.input = util.fold(p.string || p.array.join(' '));
  o.path = o.input;

  var url;
  if((o.url = o.path.match(/\/\S+/))){
    url = util.url.parse(o.url = o.url[0]);
    url = o.url.replace((url.search || '') + (url.hash || ''), '');
    o.path = o.path.replace(o.url, url.replace(/\/+$/, '') || '/');
  }

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

  var cache = this.cache;
  // already defined ? give regex
  o.regex = cache.paths[o.depth] || [ ];
  if((o.index = o.regex.indexOf(o.path)) > -1){
    o.regex = cache.regex[o.depth][o.index];
    return this;
  }

  o.regex = '^' + o.path.replace(/\S+/g, function(stem){
    o.sep = (/\//).test(stem) ? '/#?' : '.';
      return stem.replace(util.paramRE, function($0, $1, $2, $3){
        o.params = o.params || Boolean($3);
        return $1 + ($3 || '([^' + o.sep + '^]+)');
      });
    }).replace(/[\/\.]/g, '\\$&')
      .replace(/\/\S+/, '$&\\/?')
      .replace(/\^\]\+/g, ' ]+');

  if(cache.regex.length < o.depth + 1){ // prepare cache arrays
    o.index = cache.regex.length;
    while(o.index < o.depth + 1){
      cache.paths.push([ ]);
      o.index = cache.regex.push([ ]);
    }
    // update depths
    cache.masterRE.depth = cache.masterRE._.push(o.depth)-1;
    cache.masterRE._ = cache.masterRE._.sort();
  }

  // paths with custom params go first
  o.method = o.params ? 'unshift' : 'push';
  cache.paths[o.depth][o.method](o.path);
  cache.regex[o.depth][o.method](new RegExp(o.regex, 'i'));

  cache.masterRE[o.depth] =
    new RegExp(cache.regex[o.depth]
      .map(function(re){ return re.source; })
      .join('|').replace(/[(]/g,'(?:'), 'i');

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

  o.found = this.cache.masterRE;
  if(o.depth > o.found.depth){ o.depth = o.found.depth; }

  while(o.index > -1){
    o.index = o.found._[o.depth];
    if(o.index === void 0){ return null; }
    if(o.found[o.index].test(o.path)){
      o.depth = o.index;
      o.found = o.path;
      o.index = -1;
    } else { o.depth--; }
  }

  o.index = 0;
  o.regex = this.cache.regex[o.depth];
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
