'use strict';

var util = require('./util');
var type = require('utils-type');
var merge = require('utils-merge');

var cache = util.cache;

// ok, two methods
// one for getting and another for setting

function parth(path, opts){
  return parth.get(path, opts);
}

parth.parse = function(path, opts){
  path = type(path); var p = { };
  p.path = (path.string || '').trim();

  // not a path or cached
  if(!p.path){ return { }; }
  if(cache[p.path]){
    cache[p.path].cached = true;
    return cache[p.path];
  }
  // parse options
  opts = type(opts).plainObject || { };

  // separation token
  p.sep = type(opts.sep).string ||
    (p.path.match(/(\\|\/)(?=[\/\\])|(\\|\/)/)
      || p.path.match(/\./) || '  ')[0];

  // possible tokens
  p.tokens = type(opts.tokens).regexp || new RegExp('['+
    p.sep.replace(/[\/\\]/, '\\$&\\#\\?') +
  ']+', 'g');

  // if not space escape it
  if( p.sep.trim() ){  p.sep = '\\' + p.sep;  }
  p.sep = new RegExp(p.sep, 'g');

  // choose space as invariant token
  p.depth = p.path.split(p.tokens).length;
  p.parsed = p.path.replace(p.tokens, ' ');

  // check + prepare paths and regexes
  var index;
  if( cache.re.length < p.depth ){
    index = cache.re.length;
    while(index < p.depth){
      cache.paths.push([ ]);
      cache.masterRE.push('');
      index = cache.re.push([ ]);
    }
  }

  // hints
  var isRelative = new RegExp('^' + p.sep.source);
  if(!isRelative.test(p.path)){  p.relative = true;  }
  else { p.depth--; }
  if(p.path.indexOf(':') < 0){
    p.raw = true; cache[p.path] = {
           sep : p.sep,
        tokens : p.tokens,
         depth : p.depth,
           raw : true,
      relative : Boolean(p.relative)
    };
  }

  return p;
};

parth.set = function set(path, opts){
  var p = this.parse(path, opts);
  if(p.raw){ return this; }
  else if(p.cached){ return this; }

  // get the params
  var parsed = p.re = p.parsed.trim().substring(0);
  parsed.replace(/\:\S+/g,
    function($0){
      var par = $0.split(':').slice(1);
      util.sanitizeParam(par);
      console.log('par', par, p);
      p.re = p.re.replace($0, (par[1] || '(\\S+)'));
      p.parsed = p.parsed.replace($0, ':'+par[0]);
    });

  p.re += p.sep.source + '?';
  if(!p.relative){  p.re = '^' + p.sep.source + p.re;  }
  p.re = new RegExp(p.re.replace(/[ ]/g, p.sep.source), 'g');

  // add to cache
  cache[p.path] = p;
  cache.re[p.depth].push(p.re);
  cache.paths[p.depth].push(p.path);
  // adjust masterRE
  var re = p.re.source;
  var masterRE = cache.masterRE[p.depth].source || '';
  if(masterRE){ re = '|' + re; }
  cache.masterRE[p.depth] = new RegExp(masterRE + re,'g');

  return this;
};

parth.get = function(path){
  if( !path ){ return null; }

  var copy;
  if( cache[path] ){
    copy = merge({ }, cache[path]);
    return copy;
  }

  var p = util.tokenize(path);
  var re = cache.masterRE[p.depth];
  if(!re){ return null; }
  if(!re.test(p.path)){ return null; }

  var index = 0;
  re = cache.re[p.depth];

  while( !re[index].test(path) ){ index++;  }
  p = merge({}, cache[cache.paths[p.depth][index]]);

  index = 0; p.params = { };
  var param = p.parsed.match(/\:\S+/g) || [ ];
  path.replace(p.re, function(/* arguments */){
      var label = param[index] || '';
      if(!label){ index++; return; }
      p.params[label.substring(1)] = arguments[index+1];
      index++; p.params._ = '?';
    });

  p.params._ = util.getArgs(p);
  copy = merge({ }, p);
  return copy;
};

parth.cache = cache;

module.exports = parth;
