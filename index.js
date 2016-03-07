'use strict';

var util = require('./lib/util');

exports = module.exports = Parth;

function Parth(){
  if(!(this instanceof Parth)){
    return new Parth();
  }

  this.store = {};
  this.regex = [];
  this.regex.master = new RegExp('(?:[])');
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
var qsRE = /(\/?[?#][^!=:][^\s]+)/g;
var depthRE = /((^|[/?#.\s]+)[(:\w])/g;
var paramRE = /:([-\w]+)(\([^\s]+?[)][?)]*)?/g;
var noParamRE = /(^|[/.=\s]+)(\(.+?\)+)/g;

Parth.prototype.set = function(path, opt){
  if(typeof path !== 'string'){
    return this;
  }

  var o = util.clone(opt || {}, true);

  o.path = path.replace(/\s+/g, ' ').trim();

  if(this.store[o.path]){
    util.merge(this.store[o.path], o);
    return this;
  }
  this.store[o.path] = o;

  var index = -1;
  o.stem = o.path.replace(noParamRE, function($0, $1, $2){
    return $1 + ':' + (++index) + $2;
  });

  var url = (o.stem.match(/[^\/:(\s]*\/\S*/) || ['']).pop();
  var qsh = (url.match(qsRE) || ['\\/?:queryFragment([?#][^/\\s]+)?']).pop();
  o.stem = o.stem.replace(url, url.replace(qsRE, '') + qsh);

  o.depth = -1;
  o.stem.replace(depthRE, function(){ ++o.depth; });

  o.regex = new RegExp('^' +
    o.stem.replace(/\S+/g, function(s){
      return s.replace(paramRE, function($0, $1, $2){
        return ($2 || '([^?#./\\s]+)');
      });
    }).replace(/[^?( )+*$]+(?=\(|$)/g, function escapeRegExp($0){
      return $0.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
    })
  );

  this.regex.push(o);
  /** order regexes according to
   * - depth (number of separation tokens
   * - if that fails, use localCompare
  **/
  this.regex.sort(function(x, y){
    return (y.depth - x.depth) || y.stem.localeCompare(x.stem);
  });

  /** sum up all learned
   * - void all groups
   * - make a giant regex
  **/
  this.regex.master = new RegExp( '(' +
    this.regex.map(function voidRegExp(el){
      return el.regex.source.replace(/\((?=[^?])/g, '(?:');
    }).join(')|(') + ')'
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
  if(typeof path !== 'string'){
    return {notFound: true};
  }

  path = path.replace(/\s+/g, ' ').trim();
  var o = {match: path, notFound: path || true};

  if(this.store[path]){
    o.notFound = false;
    return util.merge(util.clone(this.store[path], true), o);
  }

  var found = this.regex.master.exec(path);
  if(!found){ return o; }

  o.match = found.shift();
  o.notFound = path.replace(o.match, '') || false;

  found = this.regex[found.indexOf(o.match)];
  var params = found.regex.exec(path).slice(1);
  if(params.length){ o.params = {}; }

  var index = -1;
  found.stem.replace(paramRE, function($0, $1){
    o.params[$1] = params[++index];
  });

  return util.merge(util.clone(found, true), o);
};
