'use strict';

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
       paths : [ ],
      regexp : [ ],
    masterRE : [ ]
  };
  return parth;
}
//----
// ## parth.sep
// path separation token, defaults to [ ]
//----
Parth.prototype.sep = function(path, opts){
  var p = { path : (type(path).string || '').trim() };
  if(!p.path){ return null; }  if(this.cache[p.path]){
    this.cache[p.path].cached = true;
    return this.cache[p.path];
  }

  opts = type(opts).plainObject || { };
  p.sep = type(opts.sep).string ||
    (p.path.match(/(\\|\/|\.)(?=\:)|(\\|\/|\.)/) || ' ')[0];

  return p;
};
//----
// ## parth.tokenize
// > possible split tokens
//----
Parth.prototype.tokenize = function(path, opts){
  var p = this.sep(path, opts);
  if(!p){ return null; }  if(p.cached){ return p; }

  opts = type(opts).plainObject || { };
  p.tokens = type(opts.tokens).regexp || new RegExp('[' +
    p.sep.replace(/[\/\\]/, '\\$&\\#\\? ') +
  ']+','g');

  // if p.sep is not a space scape it
  if( p.sep.trim() ){ p.sep = '\\' + p.sep; }

  // depth and relative?
  p.depth = p.path
    .replace(p.tokens, ' ').trim()
    .split(/[ ]+/).length;

  if(!p.path[0].match(p.tokens)){ p.relative = true; }

  // path with no params
  if(p.path.indexOf(':') < 0){
    p = this.cache[p.path] = {
          path : p.path,
           sep : p.sep,
        tokens : p.tokens,
         depth : p.depth,
           raw : true,
      relative : Boolean(p.relative)
    };
    return p;
  }

  // has query
  var index = p.path.indexOf('?');
  if(index > -1){
    p.query = p.path.substring(index);
    if( p.query.indexOf(':') < 0 ){
      p.path = p.path.substring(0, index+1) + ':query';
    }
  }

  return p;
};
//----
// ## parse path
//
//----
Parth.prototype.parse = function(path, opts){
  var p = this.tokenize(path, opts);
  if(!p){ return null; }  if(p.cached){ return p; }

  // space as invariant token, trim right
  p.parsed = p.path
    .replace(p.tokens, ' ')
    .replace(/[ ]+$/, '');

  // parse params
  var parsed = p.re = p.parsed.substring(0);
  parsed.replace(/\:\S+/g,
    function($0){
      var param = $0.split(':').slice(1);
      sanitizeParam(param);
      p.parsed = p.parsed.replace($0, ':'+param[0]);
      p.re = p.re.replace($0, (param[1] || '(\\S+)'));
      p.hasRE = p.hasRE || param[1];
    });

  if(!p.relative){  p.re = '^' + p.re;  }
  if(p.query){
    p.re = p.re.split(/[ ]/);  p.query = p.re.pop();
    p.re = p.re.join(' ') + ' ?\\?' + p.query;
    delete p.query;
  }
  p.hasRE = Boolean(p.hasRE);
  p.re = new RegExp(p.re.replace(/[ ]/g, p.sep));
  console.log('parsed', p);
  return p;
};
//
// ## set a path
// :api private
//
Parth.prototype.set = function(path, opts){
  var p = this.parse(path, opts);
  if(p.raw){ return this; }
  else if(p.cached){ return this; }
  var depth = p.depth-1;

  var index, cache = this.cache;
  // check + prepare paths and regexes
  if( cache.regexp.length < p.depth ){
    index = cache.regexp.length;
    while(index < p.depth){
      cache.paths.push([ ]);
      cache.masterRE.push('');
      index = cache.regexp.push([ ]);
    }
  }

  // add to cache
  cache[p.path] = p;
  cache.regexp[depth].push(p.re);
  cache.paths[depth].push(p.path);
  // adjust masterRE
  var re = p.re.source;
  var masterRE = cache.masterRE[depth].source || '';
  if(masterRE){ re = '|' + re; }

  cache.masterRE[depth] = new RegExp(masterRE + re);

  return this;
};

//
// ## get a path
//

Parth.prototype.get = function(path, opts){
  var p = this.tokenize(path, opts);
  if(!p){ return null; } if(p.cached){ return p; }

  var index = 0;
  var depth = p.depth-1;
  var cache = this.cache;
  var part = cache.masterRE[depth];

  if(!part){ return null; }
  if(!part.test(path)){ return null; }

  part = cache.regexp[depth];
  while(!part[index].test(path)){  index++;  }
  part = cache[cache.paths[depth][index]];

  p.params = {_:[ ]};
  var labels = part.parsed.match(/\:\S+/g);
  var params = p.path.match(part.re).slice(1);
  labels.forEach(function(label, index){
    var param = params[index];
    p.params[label.substring(1)] = param;
  });

  p.params._ = part.parsed.replace(/\:\S+/g,
    function($0){
      var param = p.params[$0.substring(1)];
      if(!param){  return '';  }
      return param;
  }).replace(/[ ]/, ' ').trim().split(/[ ]/);

  p.path = part.path;
  p.raw = Boolean(p.raw);
  return p;
};

//----
// ## sanitizeParam
//   > sanitizes regexParameters :name:regex
//   :api private
//----
function sanitizeParam(param){
  if(!param[1]){ return null; }
  param[1] = '(' + param[1].replace(/^\(|\)$/g,'') + ')';
}
