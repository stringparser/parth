'use strict';

var Url = require('url');
var type = require('utils-type');
var merge = require('utils-merge');

exports = module.exports = Parth;

function Parth(cache){

  if( !(this instanceof Parth) ){
    return new Parth(cache);
  }

  function parth(path, opts){
    return parth.get(path, opts);
  }
  merge(parth, this);
  parth.cache = type(cache).plainObject || {
    raws: [ ],
    paths : [ ],
    regexp : [ ],
    masterRE : [ ]
  };
  return parth;
}
//----
// ## parth.tokenize
// > possible split tokens
//----
Parth.prototype.tokenize = function(path, opt){
  var p = { input : (type(path).string || '').trim() };
  if(!p.input){ return null; }
  opt = type(opt).plainObject || { };

  p.path = p.input;

  var url;
  if((url = p.path.match(/\/\S+/))){
    url = Url.parse(url[0]);
    if(url.hash){ p.hash = url.hash; }
    if(url.query){ p.query = url.query; }
    p.path = p.path.replace(url.path, url.pathname);
  } url = null;

  p.argv = p.path
    .replace(/\(.+?\)/g, '')
    .replace(/\S+/g,
      function($0){
        var sep = $0.match(/[\\\/]+/) || $0.match(/[\.]/);
        while(sep){
          if(!sep){ $0 = $0 + ' '; }
          else    { $0 = $0.replace(sep[0], ' '); }
          sep = $0.match(/[\\\/]+/) || $0.match(/[\.]/);
        }
        return $0;
    }).trim();

  return p;
};
//----
// ## parse path
//  > parse the path using previous tokens
//----
Parth.prototype.parse = function(path, opt){
  var p = this.tokenize(path, (opt = opt || { }));
  if(!p.path){ return null; } if(p.raw){ return p; }

  opt.sep = type(opt.sep).regexp || /[\\\/\.]+/g;
  opt.param = type(opt.group).regexp || /(\:\w+)(\(.+?\))?/g;

  p.path = p.path.replace(new RegExp(opt.sep.source+'$'), '').trim();

  var param = { };
  p.input.replace(opt.param,
    function($0, $1, $2){
      param[$1] = $2 || '(\\S+)'; return $1; });

  p.regexp = p.path
    .replace(/\(.+?\)/g, '')
    .replace(opt.sep, '\\$&')
    .replace(/[ ]+/g, '[ ]+')
    .replace(/(\:\w+)/g, function($0){ return param[$0]; });

  p.regexp = new RegExp('^' + p.regexp + '(.+)?', 'i');

  return p;
};
//
// ## set a path
//
Parth.prototype.set = function(path, opts){
  var p = this.parse(path, opts);
  if(!p){ return this; }

  var index;
  var depth = p.argv.split(/[ ]+/).length-1;

  // check + prepare paths and regexes
  if(this.cache.regexp.length < depth+1){
    index = this.cache.regexp.length;
    while(index < depth+1){
      this.cache.paths.push([ ]);
      this.cache.masterRE.push('');
      index = this.cache.regexp.push([ ]);
    }
  }

  p.hasRE = !(/\:w+/).test(p.input) || (/\(.+?\)/g).test(p.input);

  // parameter cache
  var method = 'push';
  if(p.hasRE){ method = 'unshift'; }
  this.cache.paths[depth][method](p.path);
  this.cache.regexp[depth][method](p.regexp);

  // adjust masterRE
  var masterRE = this.cache.masterRE[depth].source || '';

  if(!masterRE){
    masterRE = p.regexp.source;
  } else if(p.hasRE){
    masterRE = p.regexp.source + '|' + masterRE;
  } else {
    masterRE = masterRE + '|' + p.regexp.source;
  }

  this.cache.masterRE[depth] = new RegExp(masterRE, 'i');

  // wipe
  p = masterRE = method = index = depth = null;

  return this;
};

//
// ## get a previously set path
//

Parth.prototype.get = function(path, opts){
  var p = this.tokenize(path, (opts = opts || { }));
  if(!p.path){ return null; }

  var depth = p.argv.split(/[ ]+/).length-1;
  var regexp = this.cache.masterRE[depth];

  if(!regexp){ return null; }
  if(!regexp.test(p.path)){ return null; }

  var index = 0;
  regexp = this.cache.regexp[depth];
  while( !regexp[index].test(p.path) ){ index++; }
  regexp = this.cache.regexp[depth][index];

  var params = p.path.match(regexp).slice(1);

  p.params = { };
  p.path = this.cache.paths[depth][index];
  p.regexp = regexp;

  index = 0;
  p.path.replace(/\:(\w+)/g,
    function($0, label){
      return (p.params[label] =
        params[index++].replace(/[\/]$/g, ''));
    });

  // wipe
  index = regexp = depth = params = null;
  return p;
};
