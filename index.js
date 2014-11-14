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
  if(!p.path){ return null; }

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
  if(!p){ return null; }

  opts = type(opts).plainObject || { };
  p.tokens = type(opts.tokens).regexp || new RegExp('[' +
    p.sep.replace(/[\/\\]/, '\\$&\\#') +
  ']+','g');

  // if p.sep is not a space scape it
  if( p.sep.trim() ){ p.sep = '\\' + p.sep; }
  // path with no params
  if(p.path.indexOf(':') < 0){  p.raw = true; }

  // query
  var query = p.path.replace(p.tokens, ' ').split('?');
  p.query = query[1];
  if(p.query && p.query.indexOf(':') > -1){
    p.path = query[0];
  }
  if(!p.query){ delete p.query; }

  // depth
  p.depth = p.path
    .replace(p.tokens, ' ').trim()
    .split(/[ ]+/).length;

  console.log('tokenize path', p);
  return p;
};
//----
// ## parse path
//
//----
Parth.prototype.parse = function(path, opts){
  var p = this.tokenize(path, opts);
  if(!p){ return null; }  if(p.cached){ return p; }
  if(!p.tokens.test(p.path[0])){ p.relative = true; }
  // space as invariant token, trim right
  p.parsed = p.path
    .replace(p.tokens, ' ')
    .replace(/[ ]+$/, '');

  // params
  var parsed = p.re = p.parsed.substring(0);
  parsed.replace(/\:\S+/g,
    function($0){
      var param = $0.split(':').slice(1);
      sanitizeParam(param);
      p.parsed = p.parsed.replace($0, ':'+param[0]);
      p.re = p.re.replace($0, (param[1] || '(\\S+)'));
      p.hasRE = p.hasRE || param[1];
    });

  // regexp
  p.re += ' ?';  if(!p.relative){  p.re = '^' + p.re;  }
  if(p.query && p.query.indexOf(':') > -1) {
    p.re += '\\' + p.query;
  }
  p.re = new RegExp(p.re.replace(/[ ]/g, p.sep));

  return p;
};
//
// ## set a path
// :api private
//
Parth.prototype.set = function(path, opts){
  var p = this.parse(path, opts);
  if(!p){ return this; }

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
  cache.paths[depth].push(p.path);
  cache.regexp[depth].push(p.re);

  // adjust masterRE
  var re = p.re.source;
  var masterRE = cache.masterRE[depth].source || '';
  if(masterRE){
    if(p.hasRE){ masterRE = re + '|' + masterRE; }
          else { masterRE = masterRE + '|' + re; }
  }
  delete p.hasRE;
  cache.masterRE[depth] = new RegExp(masterRE);

  return this;
};

//
// ## get a path
//

Parth.prototype.get = function(path, opts){
  var p = this.tokenize(path, opts);
  console.log('\n----\n');
  console.log('p', p);
  if(!p){ return null; }

  var cache = this.cache;
  var regexp = cache.masterRE[p.depth-1];
  if(!regexp){ return null; }
  if(!regexp.test(p.path)){ return null; }

  var index = 0; regexp = cache.regexp[p.depth-1];
  while(!regexp[index].test(p.path)){
    index++;
  }
  var part = cache[cache.paths[p.depth-1][index]];
  var labels = part.parsed.match(/\:\S+/g);
  var params = p.path.match(part.re).slice(1);
  p.path = part.path;
  p.params = { };
  labels.forEach(function(label, index){
    var param = params[index];
    p.params[label.substring(1)] = param;
  });

  p.argv = part.parsed.replace(/\:\S+/g, function($0){
      var param = p.params[$0.substring(1)];
      if(!param){  return '';  }
      return param;
  }).replace(/[ ]/, ' ').trim().split(/[ ]/);

  console.log('regexp', regexp);

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
