'use strict';

var util = require('./util');
var type = require('utils-type');
var merge = require('utils-merge');

var cache = util.cache;

exports = module.exports = parth;

function parth(path, opts){
  return parth.get(path, opts);
}

//
// ## tokenize the given path
//

parth.tokenize = function(path, opts){
  var p = { }; p.path = (type(path).string || '').trim();
  // not a path or cached
  if(!p.path){ return { }; }  if(cache[p.path]){
    cache[p.path].cached = true;
    return cache[p.path];
  }

  // options
  opts = type(opts).plainObject || { };

  // separation token
  p.sep = type(opts.sep).string ||
    (p.path.match(/(\\|\/|\.)(?=\:)|(\\|\/|\.)/) || '  ')[0];

  // possible tokens
  p.tokens = type(opts.tokens).regexp || new RegExp('['+
    p.sep.replace(/[\/\\]/, '\\$&\\#\\?') +
  ']+', 'g');

  // if not space escape it
  if( p.sep.trim() ){  p.sep = '\\' + p.sep;  }
  p.sep = new RegExp(p.sep, 'g');

  // choose space as invariant token, trim right
  p.parsed = p.path.replace(p.tokens, ' ')
    .replace(/[ ]+$/, '');

  // find out depth
  p.depth = p.path.split(p.tokens);
  p.depth = p.depth[0]
    ? p.depth.length
    : p.depth.length-1;

  return p;
};

//
// ## parse the path
//

parth.parse = function(path, opts){
  var p = this.tokenize(path, opts);

  // check + prepare paths and regexes
  var index;
  if( cache.re.length < p.depth+1 ){
    index = cache.re.length;
    while(index < p.depth){
      cache.paths.push([ ]);
      cache.masterRE.push('');
      index = cache.re.push([ ]);
    }
  }

  // hints
  console.log('query?', p.path.indexOf('?'));
  index = p.path.indexOf('?');
  if(index > -1){  p.query = p.path.substring(index);  }    
  var isRelative = new RegExp('^' + p.sep.source);
  if(!isRelative.test(p.path)){  p.relative = true;  }
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
  p.parsed.substring(0).replace(/\:\S+/g,
    function($0, index, _){
      var par = $0.split(':').slice(1);
      util.sanitizeParam(par);
      p.re = (p.re || _).replace($0, (par[1] || '(\\S+)'));
      p.parsed = p.parsed.replace($0, ':'+par[0]);
    });

  p.re += p.sep.source + '?';
  if(!p.relative){  p.re = '^' + p.re;  }
  p.re = new RegExp(p.re.replace(/[ ]/g, p.sep.source));

  var depth = p.depth-1;
  // add to cache
  cache[p.path] = p;
  cache.re[depth].push(p.re);
  cache.paths[depth].push(p.path);
  // adjust masterRE
  var re = p.re.source;
  var masterRE = cache.masterRE[depth].source || '';
  if(masterRE){ re = '|' + re; }

  cache.masterRE[depth] = new RegExp(masterRE + re);

  return this;
};

parth.get = function(path, opts){
  if( !path ){ return null; }
  var cached = cache[path];
  if( cached ){ return cached; }

  var p = this.tokenize(path, opts);
  console.log('orig path', path);
  console.log('tokenized', p);
  var depth = p.depth-1;
  var re = cache.masterRE[depth];
  console.log(cache.masterRE[depth], depth);
  if(!re){ return null; }
  if(!re.test(p.path)){ return null; }

  var index = 0;  re = cache.re[depth];
  while( !re[index].test(path) ){  index++;  }
  var part = cache[cache.paths[depth][index]];

  p.params = { };
  var labels = part.parsed.match(/\:\S+/g);
  var params = p.path.match(part.re).slice(1);
  console.log('labels', labels);
  console.log('params', params);
    labels.forEach(function(label, index){
      console.log(label, params[index]);
      p.params[label.substring(1)] = params[index];
    });

  p.params._ = util.getArgs(p);
  return p;
};

parth.cache = cache;
