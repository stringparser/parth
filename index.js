'use strict';

var util = require('./lib/util');

exports = module.exports = Parth;

function Parth(o){
  o = o || {};
  if(this instanceof Parth){
    this.regex = [];
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
  var regex = this.regex[o.depth-1];

  if(!regex){
    var index = this.regex.length;
    while(index < o.depth){
      index = this.regex.push([]);
      this.regex[index-1].master = /(?:[])/;
    }
    regex = this.regex[o.depth-1];
  }

  // default and custom regexes indexes
  var sep;
  var parsed = '^' + o.path.replace(/\S+/g, function(stem){
    sep = (stem.match(/\//) || stem.match(/\./) || ' ')[0].trim();
    return stem.replace(paramRE, function($0, $1, $2, $3){
      return $1 + ($3 || '([^'+sep+' ]+)');
    });
    // ↓ escape separation tokens outside parens
  }).replace(/(.*?)(?:\(.+?\)+|$)/g, function($0, $1){
    return $0.replace($1, util.escapeRegExp);
  });

  // attach some metadata
  parsed = new RegExp(parsed);
  parsed.path = o.path;
  parsed.depth = o.depth;
  parsed.cus = (o.path.match(/\(.*?\)/g) || []).length;
  parsed.def = (o.path.match(paramRE) || []).length - parsed.cus;

  // ## reorder from more to less strict
  // - raw paths (no params) go first
  // - custom regexes have more weight than defaults
  //
  regex.push(parsed);
  regex = regex.sort(function(a, b){
    return (a.def - b.cus) - (b.def - a.cus);
  });

  // ## sum up all learned
  // - void groups
  // - make one regex per depth
  // - make a giant regex for everything
  //
  regex.master = new RegExp('(' +
    regex.map(function(re){
      var group = re.source.replace(/\((?=[^?])/g, '(?:');
      if(re.def + re.cus){
         return '(?:'+ group +')|(?:^'+ util.escapeRegExp(re.path) +')';
      } else {
        return group;
      }
    }).join(')|(') + ')'
  );

  // BEHOLD! THE GIANT REGEXP
  this.regex.master = new RegExp('(' +
    this.regex.map(function(re){
      return re.master.source.replace(/\((?=[^?])/g, '(?:');
    }).reverse().join(')|(') + ')'
  );// -----------Oooo---
  // ------------(----)---
  // -------------)--/----
  // -------------(_/-
  // -----oooO----
  // -----(---)----
  // ------\--(--
  // -------\_)-
  //

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

  o = util.boil(path, o); o.notFound = true;
  var parth = this.regex.master.exec(o.path);
  if(!parth){ return null; }

    o.match = parth.shift();
    o.depth = this.regex.length-parth.indexOf(o.match)-1;
  var found = this.regex[o.depth].master.exec(o.path);
  var regex = this.regex[o.depth][found.indexOf(found.shift())];
   o.params = {_: o.path.match(regex).slice(1)};

  var index = -1;
  regex.path.replace(paramRE, function($0, $1, $2){
    o.params[$2] = o.params._[++index];
    o.params._[index] = $2;
  });

  o.notFound = o.path.replace(o.match, '') || false;
  return regex;
};
