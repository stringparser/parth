'use strict';

var util = require('./lib/util');

exports = module.exports = Parth;

function Parth(o){
  o = o || {};
  if(this instanceof Parth){
    this.regex = {length: 0};
    this.store = {
      name: typeof o.name !== 'string' ? '#rootNode' : o.name,
      children:{}
    };
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

  var node = this.store.children;
  var found = this.regex[o.depth];

  if(node[o.path]){
    return found[found.indexOf(node[o.path].regex)];
  } else if(!found){
    while(this.regex.length < o.depth){
      this.regex[++this.regex.length] = null;
    }
    found = this.regex[o.depth] = [ ];
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

  // attach relevant info.
  o.regex = new RegExp(o.regex, 'i');
  o.regex.path = o.path;
  o.regex.cus = cus; o.regex.def = def;

  // reorder them
  found.push(o.regex);
  found = found.sort(function(a, b){
    return (a.def - b.cus) - (b.def - a.cus);
  });

  // sum up all learned: void groups and make one master per depth
  found.master = new RegExp(found.map(function(re){
    return '(' + re.source.replace(/\((?=[^?])/g, '(?:') + ')';
  }).join('|'), 'i');

  node[o.path] = o;
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
  var regex = this.regex;
  var found = this.store.children[o.path];

  if(found){
    o.match = o.path; o.notFound = false; regex = regex[o.depth];
    return regex[regex.indexOf(found.regex)];
  } else if(index > regex.length){
    index = regex.length;
  }

  while(index > -1){
    found = regex[index] && regex[index].master;
    if(found && found.test(o.path)){
      found = o.path.match(regex[index].master).slice(1);
      o.depth = index; index = -1;
      o.match = found.join('');
    } else if(--index < 1){ return null; }
    // ^ depth starts at 1 :), notFound
  }

  regex = regex[o.depth][found.indexOf(o.match)];
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
