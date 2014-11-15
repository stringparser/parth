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
       paths : [ ], regexp : [ ], masterRE : [ ]
  };
  return parth;
}
//----
// ## parth.sep
// path separation token, defaults to [ ]
//----
Parth.prototype.sep = function(path, opt){
  var p = { }; p.input = path;
  opt = type(opt).plainObject || { };
  opt.sep = type(opt.sep).string || '';

  p.path = type(path);
  p.path = p.path.array
     ? p.path.array.join(opt.sep || ' ')
     : p.path.string || '';
  if(!p.path){ return null; }

  p.sep = opt.sep
    || (p.path.match(/(?!\:)(.?\/|.?\.|.\\+|^\\)/) || '  ')[0];
  if(p.sep.length > 1){ p.sep = p.sep.substring(1); }

  return p;
};
//----
// ## parth.tokenize
// > possible split tokens
//----
Parth.prototype.tokenize = function(path, opts){
  var p = this.sep(path, opts); if(!p){ return null; }
  opts = type(opts).plainObject || { };

  p.path = p.path.split('?');
  // -- start

  p.tokens = type(opts.tokens).regexp
    || new RegExp('['+p.sep.replace(/[\/\\]/, '\\$&\\#')+' ]+','g');

  if(p.path[1]){ p.query = p.path[1]; }

  p.depth = p.path[0].replace(p.tokens, ' ').trim()
    .split(/[ ]+/).length-1;
  //-- end
  p.path = p.path[0];

  // path has no params in it
  if(p.path[0].indexOf(':') < 0){
    p.raw = true;
    this.cache[p.path] = p;
    return p;
  }

  return p;
};
//----
// ## parse path
//  > parse the path using previous tokens
//----
Parth.prototype.parse = function(path, opts){
  var p = this.tokenize(path, opts);
  if(!p){ return null; }

  // space as invariant token, trim sep right
  p.regexp = p.parsed = p.path
    .replace(p.tokens, ' ')
    .replace(new RegExp('(' + p.sep + '|' + p.sep + '\\W+)$', 'g'), 'i');

  // params
  p.regexp.replace(/\:(\S+)/g,
    function($0, label){
      var param = label.split(':');
      p.parsed = p.parsed.replace($0, ':' + param[0]);
      if(!param[1]){ param[1] = '\\S+'; }
      else { p.hasRE = p.hasRE || true; }
      p.regexp = p.regexp.replace($0,
        '(' + param[1].replace(/^\(|\)$/g,'') + ')'
      );
    });

  // regexp
  p.regexp += (p.sep.trim() ? '\\' + p.sep : '<s>');
  p.regexp = '^' + p.regexp + '?';

  p.path.match(p.tokens).forEach(function(token){
    token = token.replace(/[ ]+/, '<s>').replace(/[\/\\]/, '\\$&');
    p.regexp = p.regexp.replace(/[ ]/, token);
  });

  if(p.sep === ' '){  p.regexp = p.regexp.replace(/(<s>|<s>\W+)$/, '');  }
  p.regexp = new RegExp(p.regexp.replace(/<s>/g, '[ ]+'), 'i');

  return p;
};
//
// ## set a path
//
Parth.prototype.set = function(path, opts){
  var p = this.parse(path, opts);
  if(!p){ return this; }

  var index, cache = this.cache;
  // check + prepare paths and regexes
  if( cache.regexp.length < p.depth+1){
    index = cache.regexp.length;
    while(index < p.depth+1){
      cache.paths.push([ ]);
      cache.masterRE.push('');
      index = cache.regexp.push([ ]);
    }
  }
  // add to cache
  var method = 'push';
  if( p.hasRE ){ method = 'unshift'; }
  cache.paths[p.depth][method](p.path);
  cache.regexp[p.depth][method](p.regexp);

  // adjust masterRE
  var re = p.regexp.source;
  var masterRE = cache.masterRE[p.depth].source || '';

  if( !masterRE ){ masterRE = re; }
  else if(p.hasRE){ masterRE = re + '|' + masterRE; }
             else { masterRE = masterRE + '|' + re; }

  cache.masterRE[p.depth] = new RegExp(masterRE, 'i');

  return this;
};

//
// ## get a previously set path
//

Parth.prototype.get = function(path, opts){
  var p = this.tokenize(path, opts);
  if(!p){ return null; }

  var cache = this.cache;
  var regexp = cache.masterRE[p.depth];

  if(!regexp){ return null; }
  if(!regexp.test(p.path)){ return null; }

  regexp = cache.regexp[p.depth];
  var index = p.hasRE ? 0 : regexp.length-1;
  while( !regexp[index].test(p.path) ){
    if(p.hashRE){ index++; }
    else { index--; }
  }
  p.path = cache.paths[p.depth][index];
  regexp = cache.regexp[p.depth][index];

  if(p.path.indexOf(':') > -1){ delete p.raw; }
  if(p.query){
    p.query = '?' + path.split('?')[1];
    path = path.replace(/\?.*/, '');
    if(p.query.indexOf(':') > -1){}
  }

  var params = path.match(regexp).slice(1);
  var labels = p.path.replace(p.tokens, ' ');

  p.regexp = regexp; p.argv = [ ]; p.params = { };
  labels.match(/\:\w+(?=\:|[ ]|$)/g)
    .forEach(function(label, index){
      label = label.substring(1);
      var param = params[index];
      p.params[label] = param.replace(p.tokens, ' ').trim();
    });

  p.argv = labels.replace(/\:(\S+)/g,
    function($0, label){
      return p.params[label.split(':')[0]];
    }).trim().split(/[ ]/);

  return p;
};
