'use strict';

var util = require('./lib/util');
util.boil = require('./lib/boil');

exports = module.exports = Parth;

function Parth(){
  if(!(this instanceof Parth)){ return new Parth(); }
  this.store = {
    regex: Object.create(null),
    masterRE: Object.create(null),
  };
  this.store.masterRE.length = 0;
  this.cache = Object.create(null);
}

// ## Parth.set(path[, opt])
// > convert a string or array path to a regexp
// > TODO: implement regexp input
//
// arguments
//  - `path` type `string` or `array`
//  - `opt` type `object` optional holding all extra information
//
// return `this`
// --
// api.public
// --
//

util.paramRE = /(^|\W)\:([^()?#\.\/ ]+)(\(+[^ ]*\)+)?/g;

Parth.prototype.set = function(p){
  var o = Object.create(null);
  if(!util.boil(p, o)){ return null; }
  if(this.cache[o.path]){
    o = this.cache[o.path];
    return o.regex;
  }
  // ^ already defined

  // # of default and custom regex
  var sep; o.custom = o.default = 0;
  o.regex = '^' + o.path.replace(/\S+/g, function(stem){
    if((/\//).test(stem)){ sep = '/#?'; } else
    if((/\./).test(stem)){ sep = '.';   } else { sep = ''; }
    return stem.replace(util.paramRE, function($0, $1, $2, $3){
      if($3){ o.custom++; } else { o.default++; }
      return $1 + ($3 || '([^' + sep + '^]+)');
    });
  }).replace(/\/\S*/, '$&\\/?(?:[^ ])?') // includes /
    .replace(/\^\]\+/g, ' ]+'); // default params;

  // update depths
  o.depth = o.argv.length;
  var store = this.store;
  if(!store.regex[o.depth]){
    store.regex[o.depth] = [ ];
    while(store.masterRE.length < o.depth){
      store.masterRE[++store.masterRE.length] = null;
    }
  }

  // attach relevant info.
  o.regex = new RegExp(o.regex, 'i');
  o.regex.path = o.path; o.regex.argv = o.argv;
  o.regex.def = o.default; o.regex.cust = o.custom;

  // reorder them
  store.regex[o.depth].push(o.regex);
  store.regex[o.depth] = store.regex[o.depth].sort(function(a, b){
    return ((a.def - a.cust) || -Infinity) - (b.def - b.cust);
  });

  // sum up all learned: void groups and make it one
  store.masterRE[o.depth] =
    new RegExp(store.regex[o.depth].map(function(re){
      return '(' + re.source.replace(/\((?=[^?])/g, '(?:') + ')';
    }).join('|'), 'i');

  // clean, save & return
  delete o.default; delete o.custom;
  this.cache[o.path] = o;
  return o.regex;
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
  if(this.cache[o.path]){
    o = this.cache[o.path];
    return regex;
  }

  var found = this.store.masterRE;
  var index = found.length;
  while(index > -1){
    if(found[index] && found[index].test(o.path)){
      found = o.path.match(found[index]).slice(1);
      o.depth = index; index = -1;
    } else if(--index < 1){ return null; }
    // ^ depth starts at 1 :), notFound
  }

  o.match = found.join('');
  index = found.indexOf(o.match);
  var regex = this.store.regex[o.depth][index];
  o.params = { _ : o.path.match(regex).slice(1) };

  index = 0;
  regex.path.replace(util.paramRE, function($0, $1, $2){
    var p = o.params._[index];
    o.params[$2] = o.params._[index++] = Number(p) || p;
    o.params._[index-1] = $2;
  });

  delete o.depth;
  o.notFound = !(/[ ]/).test(o.path.replace(o.match, '')[0] || ' ');
  return regex;
};
