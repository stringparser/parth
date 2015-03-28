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
var noParamRE = /(^|[/. ]+)(\([^?].+?\)+)/g;
var paramRE = /(^|[ /.]):([A-Za-z0-9_]+)(\([^)]+?\)+)?/g;

Parth.prototype.add = function(path, opt){
  var o = util.boil(path, opt); if(!o){ return null; }

  // find groups without parameters and label them
  var index = -1;
  o.path = o.path.replace(noParamRE, function($0, $1, $2){
    return $1 + ':' + (++index) + $2;
  });

  var sep, parsed = '^' + o.path.replace(/\S+/g, function(stem){
      sep = (stem.match(/\//) || stem.match(/\./) || ' ')[0].trim();
      return stem.replace(paramRE, function($0, $1, $2, $3){
        return $1 + ($3 || '([^'+sep+' ]+)');
      });
      // now escape separation tokens outside parens
    }).replace(/(.*?)(?:\(.+?\)+|$)/g, function($0, $1){
      return $0.replace($1, util.escapeRegExp);
    });

  parsed = new RegExp(parsed);
  parsed.path = o.path;
  parsed.depth = util.boil.argv(o.path).length;

  // avoid mutation of main object
  if(this.store.children[o.path]){
    return parsed;
  }

  this.regex.push(parsed);

  // ## order regexes according to
  // - depth (number of separation tokens, [ /.])
  // - if that fails, use localCompare

  this.regex.sort(function(x, y){
    return (y.depth - x.depth) || y.path.localeCompare(x.path);
  });

  // ## sum up all learned
  // - void groups all groups first
  // - make a giant regex

  this.regex.master = new RegExp(
    '(' + this.regex.map(util.voidRE).join(')|(') + ')'
  );

  this.store.children[o.path] = o;
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
Parth.prototype.match = function(path, opt){
  var o = opt || { }; o.notFound = true;
  o = util.boil(path, o); if(!o){ return null; }

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
