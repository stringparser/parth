'use strict';

var util = require('./lib/util');

exports = module.exports = Parth;

function Parth(){
  if(!(this instanceof Parth)){
    return new Parth();
  }

  this.store = {children: {}};
  this.regex = [];
  this.regex.master = /(?:[])/;
}

// ## parth.add(path)
// > path to regex classification
// > TODO: give support for regexp input
//
// arguments
//  - path, type `string`
//  - options, type `object` optional with all extra information
//
// returns
//  - null for non-supported types
//  - regular expression from the path
//
var paramRE = /(^|\W)\:([^(?#/.: ]+)(\([^)]*?\)+)?/g;

Parth.prototype.add = function(path, opt){
  var o = util.boil(path, opt); if(!o){ return null; }

  if(this.store.children[o.path]){
    return this.store.children[o.path].regex;
  }

  var sep, def = 0, parsed = '^' +
    o.path.replace(/\S+/g, function(stem){
      sep = (stem.match(/\//) || stem.match(/\./) || ' ')[0].trim();
      return stem.replace(paramRE, function($0, $1, $2, $3){
        if(!$3){ def++; }
        return $1 + ($3 || '([^'+sep+' ]+)');
      });
      // now escape separation tokens outside parens
    }).replace(/(.*?)(?:\(.+?\)+|$)/g, function($0, $1){
      return $0.replace($1, util.escapeRegExp);
    }) + '(?:[ ]|$)';

  parsed = new RegExp(parsed);
  // attach some metadata before pushing
  parsed.path = o.path;
  parsed.depth = util.boil.argv(o.path).length;
  parsed.def = def;
  parsed.cus = (o.path.match(/\(.*?\)+/g) || []).length;

  this.regex.push(parsed);

  // ## order regexes according to
  // - raw paths (no params) go first
  // - custom regexes before defaults
  //
  // NOTE: if the diff results 0
  // paths are compared by their length
  // taking into account the number of custom regexes

  this.regex.sort(function(x, y){
    var depthDiff = y.depth - x.depth;
    if(depthDiff){ return depthDiff; }
    return (x.def + x.cus - y.def - y.cus) || (y.path.length - x.path.length);
  });

  // ## sum up all learned
  // - void groups all groups first
  // - make a giant regex

  this.regex.master = new RegExp(
    '(' + this.regex.map(util.voidRE).join(')|(') + ')'
  );

  this.store.children[o.path] = o;
  o.regex = parsed;
  return new RegExp(parsed.source);
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
Parth.prototype.match = function(path, opt){
  var o = opt || {}; o.notFound = true;
  util.boil(path, o); if(!o){ return null; }

  var found = this.regex.master.exec(o.path);
  if(!found){ return null; }

  o.match = found[0].trim();
  var regex = this.regex[found.indexOf(found.shift())];
  if(!opt){ return regex; }

  var index = -1;
  o.params = {_: o.path.match(regex).slice(1)};
  regex.path.replace(paramRE, function($0, $1, $2){
    o.params[$2] = o.params._[++index];
    o.params._[index] = $2;
  });

  o.notFound = o.path.replace(o.match, '') || false;
  return regex;
};
