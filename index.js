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
  path = (type(path).string || '').trim();
  if(!path){ return null; }
  var index, p = { };

  p.input = path;  p.path = path;
  opt = type(opt).plainObject || { };
  opt.sep = type(opt.sep).regexp || /[\\\/\.]+/g;

  // get hash
  index = p.path.indexOf('#');
  if( index > -1 ){
    p.hash = p.path.substring(index);
    p.path = p.path.substring(0, index);
  }

  // get query
  index = p.path.indexOf('?');
  if( index > -1 ){
    p.query = p.path.substring(index);
    p.path = p.path.substring(0, index);
  }

  p.path = p.path
    .replace(new RegExp(opt.sep.source+'$'), '').trim();

  p.input = p.path.substring(0);

  p.argv = p.path
    .replace(/\S+/, function($0){
      var sep = $0.match(opt.sep);
      if(!sep){ return $0; }
      return $0.replace(sep[0], ' ');
    }).trim();

  p.depth = p.argv.split(/[ ]+/g).length;

  return p;
};
//----
// ## parse path
//  > parse the path using previous tokens
//----
Parth.prototype.parse = function(path, opt){
  var p = this.tokenize(path, (opt = opt || { }));
  if(!p.path){ return null; }

  var param = { };
  opt.param = type(opt.group).regexp || /(\:\w+)(\(.+?\))?/g;

  path.replace(opt.param,
    function($0, $1, $2){ param[$1] = $2 || '(\\S+)'; return $1; });

  p.regexp = p.path
    .replace(/\(.+\)/g, '')
    .replace(/[ ]+/g, '[ ]+')
    .replace(opt.sep, '\\$&')
    .replace(/\S+$/, function($0){
      var sep = $0.match(opt.sep);
      if(!sep){ return  $0 + '[ ]?'; }
      return $0 + sep[0] + '?';
    })
    .replace(/\:\w+/g, function($0){ return param[$0]; });

  p.regexp = new RegExp('^' + p.regexp, 'i');

  return p;
};
//
// ## set a path
//
Parth.prototype.set = function(path, opts){
  var p = this.parse(path, opts);
  if(!p){ return this; }

  var index, cache = this.cache, depth;
  depth = Math.abs(p.depth);
  // check + prepare paths and regexes
  if( cache.regexp.length < depth+1){
    index = cache.regexp.length;
    while(index < depth+1){
      if(p.raw){ cache.raws.push([ ]); }
      cache.paths.push([ ]);
      cache.masterRE.push('');
      index = cache.regexp.push([ ]);
    }
  }

  // raw path cache
  if(p.raw){
    cache.raws[depth].push(p.path);
    return this;
  }
  // parameter cache
  var method = 'push';
  if( (/\(.+?\)/).test(p.path) ){ method = 'unshift'; }
  cache.paths[depth][method](p.path);
  cache.regexp[depth][method](p.regexp);

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
  if(p.raw){ return p; }
  else { delete p.raw; }

  var cache = this.cache;
  var regexp = cache.masterRE[p.depth];

  if(!regexp){ return null; }
  if(!regexp.test(p.path)){ return null; }

  var index = 0;
  regexp = cache.regexp[p.depth];
  while( !regexp[index].test(p.path) ){ index++; }
  p.path = cache.paths[p.depth][index];
  regexp = cache.regexp[p.depth][index];

  var labels = p.path.match(/:\w+/g).join(' ');
  var params = p.input.match(regexp).slice(1);

  index = 0;
  p.regexp = regexp; p.argv = [ ]; p.params = { };
  p.argv = labels.replace(/\:(\w+)/g,
    function($0, label){
      return (p.params[label] = params[index++]);
    }).trim().split(/[ ]/);

  return p;
};
