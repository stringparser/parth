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
// ## parth.sep
// path separation token, defaults to [ ]
//----
Parth.prototype.sep = function(path, opt){
  path = (type(path).string || '');
  if(!path){ return null; }
  opt = type(opt).plainObject || { };
  opt.sep = type(opt.sep).string || '';

  var p = { };  p.input = path;  p.path = path;
  p.sep = opt.sep || p.path.replace(/(\(.+?\))/g, '');
  p.sep = (p.sep.match(/(\/|\.|\\)/) || ' ')[0];

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
    || new RegExp('(?!\\:)[' +
      p.sep.replace(/[\/\\\.]/, '\\$&\\#').trim() +
    ' ]+','g');

  if(p.path[1]){ p.query = p.path[1]; }

  p.depth = p.path[0].replace(p.tokens, ' ').trim()
    .split(/[ ]+/).length-1;
  //-- end
  p.path = p.path[0];

  // path has no params in it
  if(p.path[0].indexOf(':') < 0){
    p.raw = Boolean(this.cache.raws.indexOf(p.path[0]) > -1);
    return p;
  }

  return p;
};
//----
// ## parse path
//  > parse the path using previous tokens
//----
Parth.prototype.parse = function(path, opt){
  path = (type(path).string || '').trim();
  if(!path){ return null; }

  var index, p = { };
  p.input = path;  p.path = path;
  opt = type(opt).plainObject || { };
  opt.sep = type(opt.sep).regexp || /[\\\/\.]+/g;
  opt.param = type(opt.group).regexp || /(\:\w+)(\(.+?\))?/g;

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

  p.path = p.parsed = p.path.replace(/\(.+?\)/g, '');
    // stripped regexes
    
  p.parsed = p.parsed
    .replace(opt.sep, ' ')
    // choose space as invariant sep token
    .replace(/[ ]+/g, ' ')
    // replace maybe repeated spaces
    .trim();
    // not interesed on leftovers today

  // find path depth so it can be classified
  p.depth = p.parsed.split(/[ ]+/).length;

  var param = { };
  var sepRE = new RegExp(opt.sep.source);
  var sepEndRE = new RegExp(opt.sep.source+'$', 'g');
  p.regexp = p.path
    .replace(opt.param,
      function($0, $1, $2){
        param[$1] = $2 || '(\\S+)'; return $1;
      })
    // fetched those parameter's regexes
    .replace(/\S+[ ]+|\S+/g,
      function($0){
        var sep = $0.match(sepRE);
        if( !sep ){ return $0.trim() + '[ ]+'; }
        return $0.replace(sepEndRE, '') + sep[0];
      })
    // found & added separation token at the end of each path
    .replace(opt.sep, '\\$&')
    // escaped separation tokens
    .replace(/\:\w+/g, function($0){ return param[$0]; });
    // plugged in parameter regexes of the parameter

  p.regexp = new RegExp('^' + p.regexp + '?', 'i');

  console.log(p);

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
      if(p.raw){ cache.raws.push([ ]); }
      cache.paths.push([ ]);
      cache.masterRE.push('');
      index = cache.regexp.push([ ]);
    }
  }

  // raw path cache
  if(p.raw){
    cache.raws[p.depth].push(p.path);
    return this;
  } else{ return this; }
  // parameter cache
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

  if(p.query){
    p.query = '?' + path.split('?')[1];
    path = path.replace(/\?.*/, '');
    if(p.query.indexOf(':') > -1){}
  }

  var params = p.input.match(regexp).slice(1);
  var labels = p.path.replace(p.tokens, ' ');

  index = 0;
  p.regexp = regexp; p.argv = [ ]; p.params = { };
  p.argv = labels.replace(/\:(\S+)/g,
    function($0, label){
      label = label.split(':')[0];
      return (p.params[label] = params[index++]);
    }).trim().split(/[ ]/);

  return p;
};
