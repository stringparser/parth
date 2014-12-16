'use strict';

var util = require('./lib/util');
util.boil = require('./lib/boil');

exports = module.exports = Parth;

function Parth(){
  if(!(this instanceof Parth)){ return new Parth(); }
  this.store = {
    _ : Object.create(null),
    regex: Object.create(null),
    masterRE: Object.create(null),
  };
  this.store.masterRE._ = [];
}

// ## Parth.set(p[, o]) -> path, options
// > convert a string or array path to a regexp
// > TODO: implement regexp input
//
// arguments
//  - `path` type `string` or `array`
//  - `o` type `object` optional holding all extra information
//
// return `this`
// --
// api.public
// --
//

util.paramRE = /(^|\W)\:([^()?#\.\/ ]+)(\(.+?\))?/g;

Parth.prototype.set = function(p, o){
  o = o || { }; if(!util.boil(p, o)){ return this; }

  var store = this.store;
  // already defined ? give it
  if(store._[o.path]){ o = store._[o.path]; return this; }

  o.custom = o.default = 0; // number of default and custom regex
  o.regex = '^' + o.path.replace(/\S+/g, function(stem){
    o.sep = (/\//).test(stem) ? '/#?' : '.';
      return stem.replace(util.paramRE, function($0, $1, $2, $3){
        if($3){ o.custom++; } else { o.default++; }
        return $1 + ($3 || '([^' + o.sep + '^]+)');
      });
    }).replace(/[\/\.]/g, '\\$&')
      .replace(/\/\S+/, '$&\\/?')
      .replace(/\^\]\+/g, ' ]+'); // default params

  // update depths
  if(!store.regex[o.depth]){
    store.regex[o.depth] = [ ];
    store.masterRE.depth = store.masterRE._.push(o.depth)-1;
    store.masterRE._ = store.masterRE._.sort();
  }

  o.regex = new RegExp(o.regex, 'i');
  o.regex.def = o.default;
  o.regex.cust = o.custom;
  o.regex.path = o.path;
  o.regex.argv = o.argv;

  store.regex[o.depth].push(o.regex);
  store.regex[o.depth] = store.regex[o.depth].sort(function(a, b){
    return (b.def - b.cust) - (a.def - a.cust);
  });

  // sum up all learned: void groups and make it one
  store.masterRE[o.depth] =
    new RegExp(store.regex[o.depth].map(function(re){
      return '(' + re.source.replace(/\((?=[^?])/g, '(?:') + ')';
    }).join('|'), 'i');

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
// --
// api.public
// --
//
Parth.prototype.get = function(p, o){
  o = o || { }; o.notFound = true;
  if(!util.boil(p, o)){ return null; }

  o.found = this.store.masterRE;
  o.index = o.depth = o.found.depth;

  while(o.index > -1){
    o.index = o.found._[o.depth];
    if(!o.index){ return null; } // depth starts at 1 :)
    if(o.found[o.index].test(o.path)){
      o.found = o.path.match(o.found[o.index]).slice(1);
      o.depth = o.index; o.index = -1;
    } else { o.depth--; }
  }

  o.index = o.found.indexOf(o.found.join(''));
  o.regex = this.store.regex[o.depth][o.index];

  o.index = 0;
  o.params = { _ : o.path.match(o.regex).slice(1) };
  o.notFound = o.path.replace(
    o.regex.path.replace(util.paramRE, function($0, $1, $2){
      var p = o.params._[o.index];
      o.params[$2] = o.params._[o.index++] = Number(p) || p;
      return $1 + p;
    }), '')[0] || ' ';

  o.notFound = !(/^[ ]/).test(o.notFound);
  delete o.found; delete o.index; delete o.depth;
  return o.regex.argv;
};
