'use strict';

var util = require('./lib/util');
util.boil = require('./lib/boil');

exports = module.exports = Parth;

function Parth(){
  if(this instanceof Parth){
    this.store = Object.create(null);
    this.regex = Object.create(null);
    this.master = {length: 0};
    return this;
  }
  return new Parth();
}

// ## parth.set(path)
// > convert a path to a regular expression
// > TODO: regexp input
//
// arguments
//  - path, type `string`
//
// throws error if the path type is not supported
//
// returns a regular expression for the path
//
// --
// api.public
// --
//

util.paramRE = /(^|\W)\:([^(?#/.: ]+)(\([^)]*?\)+)?/g;

Parth.prototype.set = function(p){
  var o = util.boil(p);
  if(this.store[o.path]){
    o.match = o.path;
    return this.store[o.path].regex;
  }

  // # of default and custom regex
  var sep; o.custom = o.default = 0;
  o.regex = '^' + o.path.replace(/\S+/g, function(stem){
    if((/\//).test(stem)){ sep = '/#?'; } else
    if((/\./).test(stem)){ sep = '.';   } else { sep = ''; }
    return stem.replace(util.paramRE, function($0, $1, $2, $3){
      if($3){ o.custom++; } else { o.default++; }
      return $1 + ($3 || '([^' + sep + '^]+)');
    });
  }).replace(/[^\/ ]*\/\S*/g, '$&/?(?:[^\\/ ]+)?') // includes /
    .replace(/\^\]\+/g, ' ]+') // default params
    .replace(/[^()]+(?=\(|$)/g, function($0){ // scape all outside parens
      return $0.replace(/[\/\.]/g, '\\$&');
    });


  // update depths
  o.depth = o.argv.length;
  if(!this.regex[o.depth]){
    this.regex[o.depth] = [ ];
    while(this.master.length < o.depth){
      this.master[++this.master.length] = null;
    }
  }

  // attach relevant info.
  o.regex = new RegExp(o.regex, 'i');
  o.regex.path = o.path; o.regex.argv = o.argv;
  o.regex.def = o.default; o.regex.cust = o.custom;

  // reorder them
  this.regex[o.depth].push(o.regex);
  this.regex[o.depth] = this.regex[o.depth].sort(function(a, b){
    return (a.def - a.cust) - (b.def - b.cust);
  });

  // sum up all learned: void groups and make it one
  this.master[o.depth] =
    new RegExp(this.regex[o.depth].map(function(re){
      return '(' + re.source.replace(/\((?=[^?])/g, '(?:') + ')';
    }).join('|'), 'i');

  // clean, save & return
  delete o.default; delete o.custom;
  this.store[o.path] = o;
  return o.regex;
};


// ## parth.get(path[, options])
// > take a string or array, return the matching path
//
// arguments
//  - path, type `string` or `array`
//  - options, type `object` optional holding all extra information
//
// returns regex matching path
// --
// api.public
// --
//
Parth.prototype.get = function(p, o){
  o = util.boil(p, o);
  if(this.store[o.path]){
    return util.merge(o, this.store[o.path]).regex;
  }

  o.notFound = true;
  var found = this.master;
  var index = (this.store[o.argv.length] || found).length;

  while(index > -1){
    if(found[index] && found[index].test(o.path)){
      found = o.path.match(found[index]).slice(1);
      o.depth = index; index = -1;
    } else if(--index < 1){ return null; }
    // ^ depth starts at 1 :), notFound
  }

  o.match = found.join('');
  index = found.indexOf(o.match);
  var regex = this.regex[o.depth][index];
  o.params = {_: o.path.match(regex).slice(1)};

  index = 0;
  regex.path.replace(util.paramRE, function($0, $1, $2){
    o.params[$2] = o.params._[index];
    o.params._[index++] = $2;
  });

  o.notFound = o.path.replace(o.match, '');
  return regex;
};
