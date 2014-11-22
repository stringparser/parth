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
    return parth.set(path, opts);
  }
  merge(parth, this);

  parth.cache = type(cache).plainObject || { };
  parth.cache.paths = type(parth.cache.paths).array || [ ];
  parth.cache.regexp = type(parth.cache.regexp).array || [ ];
  parth.cache.masterRE = type(parth.cache.masterRE).array || [ ];

  return parth;
}

//----
// ## tokenize path
//  > use / and . to tokenize a path to an invariant
//----

Parth.prototype.tokenize = function(path, opt){
  var p = type(path).plainObject
    || { input : (type(path).string || '').trim() };
  // return early
  if(!p.input){ return null; } if(p.argv){ return p; }

  opt = type(opt).plainObject || { };
  opt.sep = type(opt.sep).regexp || /[\/\.]+/g;
  opt.param = type(opt.group).regexp || /\:(\w+)(\(.+?\))?/g;

  p.path = p.input;

  var url;
  if((url = p.input.match(/\/\S+/))){
    url = Url.parse(url[0]);
    if(url.hash){ p.hash = url.hash; }
    if(url.query){ p.query = url.search; }
    p.path = p.input.replace(url.path, url.pathname);
  }

  p.path = p.path
    .replace(new RegExp(opt.sep.source+'$'), '').trim();

  // use space as invariant sep token
  p.argv = p.path
    .replace(/\S+/g, function($0){
      var sep = $0.match(/[\/]+/) || $0.match(/[\.]/);
      $0.replace(opt.param, function($0, label, regexp){
        p.params = p.params || { };
        p.params[label] = regexp || '([^\\' +(sep || '/')+ ' ]+)';
      });
      if(!sep){ return $0; }  sep = '\\' + sep[0];
      return $0.replace(new RegExp(sep,'g'), ' ');
    }).trim().replace(/[ ]+/g, ' ');

  p.depth = p.argv.split(/[ ]/).length;

  // wipe
  url = null;
  return p;
};
//----
// ## parse path
//  > parse the path using previous tokens
//----
Parth.prototype.parse = function(path, opt){
  var p = this.tokenize(path, (opt = opt || { }));
  if(!p){ return null; }

  // parse regexp
  if(!p.regexp){

    opt.flag = type(opt.flag).string || 'i';
    p.regexp = p.path
      .replace(/\(.+?\)/, '')
      .replace(/\S+$/,
        function($0){ return $0 + ($0.match(opt.sep) || [' '])[0]; })
      .replace(opt.sep, '\\$&')
      .replace(/[ ]+/g, '[ ]+').replace(/\+$/,'')
      .replace(/\:(\w+)/g, function($0, label){ return p.params[label]; });

    p.regexp = new RegExp('^' + p.regexp + '?', opt.flag);
    return p;
  }

  // parse params for this.get
  p.params = { };

  var index = 0;
  var params = p.input
    .replace(p.query, '')
    .match(p.regexp).slice(1);

  p.path.replace(/\:(\w+)/g,
    function($0, label){
      return (p.params[label] = params[index++]);
    });

  return p;
};
//
// ## set a path
//
Parth.prototype.set = function(path, opt){
  var p = this.parse(path, (opt = opt || { }));
  if(!p){ return this; }

  var index;
  var cache = this.cache;

  // check + prepare paths and regexes
  if(cache.regexp.length < p.depth+1){
    index = cache.regexp.length;
    while(index < p.depth+1){
      cache.paths.push([ ]);
      cache.regexp.push([ ]);
      index = cache.masterRE.push(null);
    }
  }

  // already in cache?
  if(cache.paths[p.depth].indexOf(p.path) > -1){
    p = method = index = null; // wipe
    return this;
  }

  // parameter cache
  var method = !(/\:w+/).test(p.input) ? 'unshift' : 'push';
  cache.paths[p.depth][method](p.path);
  cache.regexp[p.depth][method](p.regexp);

  // adjust masterRE
  cache.masterRE[p.depth] =
    new RegExp(
      cache.regexp[p.depth]
        .map(function(regexp){ return regexp.source; })
        .join('|'),
    opt.flag);

  // wipe
  p = method = index = null;
  return this;
};

//
// ## get a previously set path
//

Parth.prototype.get = function(path, opt_){
  var opt;
  var p = this.tokenize(path, (opt = opt_ || { }));
  if(!p.path){ return null; }

  var fallback = true;
  var index = 0, depth = p.depth;

  while(fallback){
    p.regexp = this.cache.masterRE[depth];
    fallback = !p.regexp && (this.cache.fallback || opt.fallback);
    if(!p.regexp || !p.regexp.test(p.input)){
      if(!fallback){ return null; }
      depth--; p.fallback = true;
    }
    if(depth < 0){ return null; }
  }

  p.regexp = this.cache.regexp[depth];
  while( !p.regexp[index].test(p.path) ){ index++; }
  p.regexp = this.cache.regexp[depth][index];
  p.path = this.cache.paths[depth][index];

  // wipe
  fallback = index = depth = null;
  return this.parse(p, opt);
};
