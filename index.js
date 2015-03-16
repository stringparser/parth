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

  var index, regex = this.regex;
  o.depth = util.boil.argv(o.path).length;

  if(!regex[o.depth-1]){
    index = regex.length;
    while(index < o.depth){
      index = regex.push([]);
      regex[index-1].master = /(?:[])/;
    }
  }
  regex = regex[o.depth-1];

  // default and custom regexes indexes
  var sep, cus = 0, def = 0;
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

  // attach relevant info
  o.strict = o.strict ? '$' : '';
  o.regex = new RegExp(o.regex + o.strict);
  o.regex.path = o.path; o.regex.depth = o.depth-1;
  o.regex.def = def; o.regex.cus = cus;

  // reorder them
  regex.push(o.regex);
  regex = regex.sort(function(a, b){
    return (a.def - b.cus) - (b.def - a.cus);
  });

  // ## sum up all learned
  // - void groups and
  // - make one regex per depth
  // - make a giant regex for everything
  //
  //
  regex.master = new RegExp('(' +
    regex.map(function(re){
      var group = re.source.replace(/\((?=[^?])/g, '(?:');
      if(re.def + re.cus){
         return '(?:^' + util.escapeRegExp(re.path) + '$)|(?:' + group + ')';
      } else {
        return group;
      }
    }).join(')|(') + ')'
  );

  // THE GIANT REGEXP
  // -----------Oooo---
  // -----------(----)---
  // ------------)--/----
  // ------------(_/-
  // ----oooO----
  // ----(---)----
  // -----\--(--
  // ------\_)-
  //
  this.regex.master = new RegExp('(' +
    this.regex.map(function(re){
      var src = re.master.source;
      return re.length ? src.replace(/\((?=[^?])/g, '(?:') : src;
    }).reverse().join(')|(') + ')');

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
  if(!util.boil(p, o) || !this.regex.master.test(o.path)){
    return null;
  }

  var regex = this.regex;
  var index = regex.length-1;
  var parth = regex.master.exec(o.path);
    o.match = parth.shift();
    o.depth = index - parth.indexOf(o.match);
  var found = regex[o.depth].master.exec(o.path);
      regex = regex[o.depth][found.indexOf(found.shift())];
  o.params = {_: o.path.match(regex).slice(1)};

  index = 0;
  regex.path.replace(paramRE, function($0, $1, $2){
    var p = o.params._[index], num = Number(p);
    o.params[$2] = util.isNaN(num) ? p : num;
    o.params._[index++] = $2;
  });

  o.notFound = o.path.replace(o.match, '') || false;
  return regex;
};
