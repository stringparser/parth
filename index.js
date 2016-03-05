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

var depthRE = /([ /.]+[(:\w])/g;
var paramRE = /([ /.=]?):([\w-]+)(\(.+?\)+)?/g;
var noParamRE = /(^|[ /.=]+)(\(.+?\)+)/g;

Parth.prototype.set = function(path, opt){
  if(typeof path !== 'string'){
    return this;
  }

  var o = util.clone(opt || {}, true);
  o.path = path.replace(/[ ]+/g, ' ').trim();

  if(this.store[o.path]){
    util.merge(this.store[o.path], o);
    return this;
  }
  this.store[o.path] = o;

  var index = -1;
  o.path = o.path.replace(noParamRE, function($0, $1, $2){
    return $1 + ':' + (++index) + $2;
  });

  o.depth = o.path.replace(depthRE, ' $&').trim().split(/[ ]+/).length;

  o.regex = new RegExp('^' +
    o.path.replace(/\S+/g, function(s){
      var sep = (s.match(/\//) || s.match(/\./) || ['']).pop();
      return s.replace(paramRE, function($0, $1, $2, $3){
        return $1 + ($3 || '([^' + sep + ' ]+)');
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
    return (y.depth - x.depth) || y.path.localeCompare(x.path);
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
var qsRE = new RegExp([
  '\\/?', // urls can end with slash but is optional
  '[?#]', // start of querystring/hash
  '[^!=:]', // exclude ?!, ?= and ?: regex strings
  '[^ ]+'
].join(''), 'g');

Parth.prototype.get = function(path){
  if(typeof path !== 'string'){
    return {notFound: true};
  }

  path = path.replace(/[ ]+/g, ' ').trim();
  var o = {path: path, match: path, notFound: path};
  var urls = path.match(/[^\/:( ]*\/\S*/g);

  if(urls){
    o.url = urls.length > 1 && urls || urls[0];
    urls.forEach(function(url){
      path = path.replace(url, url.replace(qsRE, ''));
    });
  }

  if(this.store[path]){
    o.notFound = false;
    return util.merge(util.clone(this.store[path], true), o);
  }

  var found = this.regex.master.exec(path);
  if(!found){ return o; }

  o.match = found.shift();
  o.notFound = path.replace(o.match, '') || false;

  found = this.regex[found.indexOf(o.match)];
  var params = {_: found.regex.exec(path).slice(1)};

  var index = -1;
  found.path.replace(paramRE, function($0, $1, $2){
    params[$2] = params._[++index];
    params._[index] = $2;
  });
  if(index > -1){ o.params = params; }

  return util.merge(util.clone(found, true), o);
};
