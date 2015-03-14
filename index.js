'use strict';

var util = require('./lib/util');

exports = module.exports = Parth;

function Parth(){
  if(this instanceof Parth){
    this.store = Object.create(null);
    this.store.children = Object.create(null);
    this.regex = Object.create(null);
    this.regex.length = 0;
    return this;
  }
  return new Parth();
}

// ## parth.add(path)
// > path to a regex adding it to parth.store
// > TODO: regexp input
//
// arguments
//  - path, type `string`
//
// returns
//  - null for non-supported types
//  - regular expression from the path
//
//

var paramRE = /(^|\W)\:([^(?#/.: ]+)(\([^)]*?\)+)?/g;

Parth.prototype.add = function(p, o){
  o = o || { }; if(!util.boil(p, o)){ return null; }

  if(this.store.children[o.path]){
    var index = this.regex[o.depth]
      .indexOf(this.store.children[o.path].regex);
    return this.regex[o.depth][index];
  }

  // default and custom regexes
  var sep, cus, def; cus = def = 0;
  o.regex = '^' + o.path.replace(/\S+/g, function(stem){
    sep = (stem.match(/\//) || stem.match(/\./) || ' ')[0].trim();
    return stem.replace(paramRE, function($0, $1, $2, $3){
      if($3){ cus++; } else { def++; }
      return $1 + ($3 || '([^'+sep+' ]+)');
    });
  }).replace(/[^()]+(?=\(|$)/g, function($0){
      // escape separation tokens outside parens
      return $0.replace(/[\/\.]/g, '\\$&');
    });

  // update depths
  if(!this.regex[o.depth]){
    while(this.regex.length < o.depth){
      this.regex[++this.regex.length] = null;
    }
    this.regex[o.depth] = [ ];
  }

  // attach relevant info.
  o.regex = new RegExp(o.regex, 'i');
  o.regex.path = o.path; o.regex.cus = cus; o.regex.def = def;

  // reorder them
  this.regex[o.depth].push(o.regex);
  this.regex[o.depth] = this.regex[o.depth].sort(function(a, b){
    return (a.def - b.cus) - (b.def - a.cus);
  });

  // sum up all learned: void groups and make one master per depth
  this.regex[o.depth].master =
    new RegExp(this.regex[o.depth].map(function(re){
      return '(' + re.source.replace(/\((?=[^?])/g, '(?:') + ')';
    }).join('|'), 'i');

  // stablish a hierarchy
  this.store.children[o.path] = o;
  return o.regex;
};


// ## parth.match(path[, options])
// > take a string or array, return the matching path
//
// arguments
//  - path, type `string`
//  - options, type `object` optional holding all extra information
//
// return
//  - null for non-supported types or not matching path
//  - regex with for the matching path
//
Parth.prototype.match = function(p, o){
  o = o || {}; o.notFound = true;
  if(!util.boil(p, o)){ return null; }

  var index = o.depth;
  var found = this.regex;

  if(this.store.children[o.path]){
    o.match = o.path; o.notFound = false; found = found[o.depth];
    index = found.indexOf(this.store.children[o.path].regex);
    return found[index];
  } else if(index > found.length){
    index = found.length;
  }

  while(index > -1){
    if(!found[index] || !found[index].master){ --index; }
    else if(found[index].master.test(o.path)){
      found = o.path.match(found[index].master).slice(1);
      o.depth = index; index = -1;
    } else if(--index < 1){ return null; }
    // ^ depth starts at 1 :), notFound
  }

  o.match = found.join('');
  index = found.indexOf(o.match);
  var regex = this.regex[o.depth][index];
  o.params = {_: o.path.match(regex).slice(1)};

  index = 0;
  regex.path.replace(paramRE, function($0, $1, $2){
    var p = o.params._[index];
    var num = Number(p);
    o.params[$2] = util.isNaN(num) ? p : num;
    o.params._[index++] = $2;
  });

  o.notFound = o.path.replace(o.match, '') || false;
  return regex;
};
