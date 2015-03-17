'use strict';

var util = require('./lib/util');

exports = module.exports = Parth;

function Parth(o){
  o = o || {};
  if(this instanceof Parth){
    this.regex = [];
    this.store = {};
    this.regex.master = /(?:[])/;
    return this;
  }

  return new Parth(o);
}

// ## parth.add(path)
// > path to regex classification
// > TODO: regexp input
//
// arguments
//  - path, type `string`
//  - options, type `object` optional holding all extra information
//
// returns
//  - null for non-supported types
//  - regular expression from the path
//

var paramRE = /(^|\W)\:([^(?#/.: ]+)(\([^)]*?\)+)?/g;

Parth.prototype.add = function(path, o){
  if(typeof path !== 'string'){ return null; }

  o = util.boil(path, o);
  if(this.store[o.path]){ return this.store[o.path]; }

  var sep, parsed = '^' +
    o.path.replace(/\S+/g, function(stem){
      sep = (stem.match(/\//) || stem.match(/\./) || ' ')[0].trim();
      return stem.replace(paramRE, function($0, $1, $2, $3){
        return $1 + ($3 || '([^'+sep+' ]+)');
      });
      // ↓ escape separation tokens outside parens
    }).replace(/(.*?)(?:\(.+?\)+|$)/g, function($0, $1){
      return $0.replace($1, util.escapeRegExp);
    });

  parsed = new RegExp(parsed);
  // attach some metadata before pushing
  parsed.path = o.path; parsed.depth = util.boil.argv(o.path).length;
  parsed.cus = (o.path.match(/\(.*?\)/g) || []).length;
  parsed.def = (o.path.match(paramRE) || []).length - parsed.cus;

  this.regex.push(parsed);

  // ## sum up all learned
  // - raw paths (no params) go first
  // - custom regexes before defaults

  this.regex.sort(function(x, y){
    if(x.depth !== y.depth){
      return y.depth - x.depth;
    }
    return (
      x.def + x.cus - (y.def + y.cus)
       || (y.source.length*(y.cus + 1) - x.source.length*(x.cus + 1))
    );
  });

  // ## make a giant regex for everything
  // - void groups all groups
  // - make one regex per depth
  // - make a giant regex for everything

  this.regex.master = new RegExp( '(' +
    this.regex.map(function(re){
      return re.source.replace(/\((?=[^?])/g, '(?:');
    }).join(')|(') + ')'
  ); // BEHOLD!

  this.store[o.path] = o;
  o.regex = parsed;

  return parsed;
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
Parth.prototype.match = function(path, o){
  if(typeof path !== 'string'){ return null; }

  o = o || {}; o.notFound = true; util.boil(path, o);
  var found = this.regex.master.exec(o.path);
  if(!found){ return null; }

  o.match = found.shift();
  var regex = this.regex[found.indexOf(o.match)];
  o.params = {_: o.path.match(regex).slice(1)};

  var index = -1;
  regex.path.replace(paramRE, function($0, $1, $2){
    o.params[$2] = o.params._[++index];
    o.params._[index] = $2;
  });

  o.notFound = o.path.replace(o.match, '') || false;
  return regex;
};
