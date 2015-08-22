'use strict';

var util = require('./lib/util');

exports = module.exports = Parth;

function Parth(){
  if(!(this instanceof Parth)){ return new Parth(); }

  this.store = {};
  this.regex = [];
  this.regex.master = /(?:[])/;
}

// ## parth.set(path)
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
var paramRE = /([ /.=]?):([\w-]+)(\(.+?(?:\)\??)+)?/g;
var noParamRE = /(^|[ /.=]+)(\(.+?(?:\)\??)+)/g;

Parth.prototype.set = function(path, opt){
  var o = util.boil(path, opt);
  if(!o){ return null; }
  var sep, index = -1;

  var stem = o.path.replace(noParamRE, function($0, $1, $2){
    return $1 + ':' + (++index) + $2;
  });

  var parsed = new RegExp('^' +
    stem.replace(/\S+/g, function(s){
      sep = (s.match(/\//) || s.match(/\./) || ' ')[0].trim();
      return s.replace(paramRE, function($0, $1, $2, $3){
        return $1 + ($3 || '([^' + sep + ' ]+)');
      });
    }).replace(/[^?( )+*$]+(?=\(|$)/g, util.escapeRegExp)
  );
  if(this.store[o.path]){ return parsed; }
  // ^ avoid mutation

  parsed.path = o.path;
  if(index > -1){ parsed.stem = stem; }
  parsed.depth = util.boil.argv(o.path).length;
  this.regex.push(parsed);

  // ## order regexes according to
  // - depth (number of separation tokens
  // - if that fails, use localCompare

  this.regex.sort(function(x, y){
    return (y.depth - x.depth) || y.path.localeCompare(x.path);
  });

  // ## sum up all learned
  // - void all groups
  // - make a giant regex

  this.regex.master = new RegExp(
    '(' + this.regex.map(util.voidRE).join(')|(') + ')'
  );

  if(/:/.test(o.path)){ o.regex = new RegExp(parsed.source); }
  this.store[o.path] = o;
  return parsed;
};


// ## parth.get(path[, options])
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
Parth.prototype.get = function(path, opt){
  var o = opt || { }; o.notFound = true;
  o = util.boil(path, o); if(!o){ return null; }

  var found = this.regex.master.exec(o.path);
  if(!found){ return null; }

  o.match = found[0].trim();
  var regex = this.regex[found.indexOf(found.shift())];
  if(!opt){ return regex; }

  var index = -1, stem = regex.stem || regex.path;
  var params = {_: o.path.match(regex).slice(1)};
  stem.replace(paramRE, function($0, $1, $2){
    params[$2] = params._[++index];
    params._[index] = $2;
  });

  o.notFound = o.path.replace(o.match, '') || false;
  if(index < 0){ return regex; }
  o.params = params;
  return regex;
};
