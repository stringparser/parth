'use strict';

var util = require('./lib/util');

exports = module.exports = Parth;

function Parth(){
  if(!(this instanceof Parth)){ return new Parth(); }

  this.store = {};
  this.regex = [];
  this.regex.master = /(?:[])/;
}


/**
## parth.set
```js
function set(string path[, object options])
```
This method purpose is to sanitize the `path` given
and classify the resulting regular expression with those
previously stored.

arguments
 - path, type `string`
 - options, type `object`, to merge with this path properties

returns `this`

> NOTE: `options` is deep cloned beforehand to avoid mutation
**/
var paramRE = /([ /.=]?):([\w-]+)(\(.+?(?:\)\??)+)?/g;
var noParamRE = /(^|[ /.=]+)(\(.+?(?:\)\??)+)/g;

Parth.prototype.set = function(path, opt){
  var o = util.boil(path, util.clone(opt, true));

  if(!o){ return this; } else if(this.store[o.path]){
    util.merge(this.store[o.path], o);
    return this;
  }

  var sep, index = -1;
  o.stem = o.path.replace(noParamRE, function($0, $1, $2){
    return $1 + ':' + (++index) + $2;
  });

  o.regex = new RegExp('^' +
    o.stem.replace(/\S+/g, function(s){
      sep = (s.match(/\//) || s.match(/\./) || ' ')[0].trim();
      return s.replace(paramRE, function($0, $1, $2, $3){
        return $1 + ($3 || '([^' + sep + ' ]+)');
      });
    }).replace(/[^?( )+*$]+(?=\(|$)/g, util.escapeRegExp)
  );

  o.depth = util.boil.argv(o.path).length;

  // ## order regexes according to
  // - depth (number of separation tokens
  // - if that fails, use localCompare

  this.regex.push(o);
  this.store[o.path] = o;
  this.regex.sort(function(x, y){
    return (y.depth - x.depth) || y.path.localeCompare(x.path);
  });

  // ## sum up all learned
  // - void all groups
  // - make a giant regex

  this.regex.master = new RegExp(
    '(' + this.regex.map(util.voidRE).join(')|(') + ')'
  );

  return this;
};


/**
## parth.get
```js
function get(string path)
```

Take a string, and return a clone of the store object properties

arguments
 - path, type `string` to match stored paths with

return
 - null for non-supported types or not matching path
 - object with all the stored information on `parth.set`

> NOTE: the returned object is a deep copy of the original `options`
> given in `parth.set` to avoid mutation
**/
Parth.prototype.get = function(path){
  var o = util.boil(path);

  if(!o){ return null; } else if(this.store[o.path]){
    return util.clone(this.store[o.path], true);
  }

  var found = this.regex.master.exec(o.path);
  if(!found){ return null; }

  var match = found.shift();
  found = this.regex[found.indexOf(match)];

  var index = -1;
  var params = {_: found.regex.exec(o.path).slice(1)};

  found.stem.replace(paramRE, function($0, $1, $2){
    params[$2] = params._[++index];
    params._[index] = $2;
  });

  if(params._.length){ o.params = params; }
  o.notFound = o.path.replace(match, '') || false;

  return util.merge(util.clone(found, true), o);
};
