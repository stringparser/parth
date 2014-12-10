'use strict';

exports = module.exports = parse;

function parse(node, o){
  o = null; // wipe
  return node;
}

parse.set = function(path, o){
  if(!o.input){ this.boil('#set')(path, o); }
  if(o === null){ return this; }
    
  var index, cache = this.cache;
  // prepare paths and regexes arrays
  if(cache.regexp.length < o.stems.length){
    index = cache.regexp.length;
    while(index < o.stems.length){
      cache.paths.push([ ]);
      cache.regexp.push([ ]);
      index = cache.masterRE.push(null);
    }
  }

  o.params = { };
  o.regexp = o.input
    .replace(/\S+/g, function(stem){
      o.sep = (stem.match(/\//) || ['.'])[0];
      return stem.replace(/(\:\w+)(\(.+?\))?/g, function($0, $1, $2){
        o.params[$1] = $2 || '([^\\' + o.sep + ' ]+)';
        return $1;
      });
    })
    .replace(/[ ]+/g, ' ')
    .replace(/[\/\.\?\#]+/g, '\\$&')
    .replace(/\:\w+/g, function($0){ return o.params[$0]; });

  if(o.depth > 1){
    o.regexp = o.regexp.replace(new RegExp('[\\' + o.sep + ']+$'), '');
    o.regexp += '\\' + o.sep + '?';
  }

  o.flag = o.strict ? '' : 'i';
  o.regexp = new RegExp('^' + o.regexp, o.flag);

  var method = (/\(.+?\)/).test(path) ? 'unshift' : 'push';

  cache.paths[o.depth][method](o.input);
  cache.regexp[o.depth][method](o.regexp);
  cache.masterRE[o.depth] = new RegExp(cache.regexp[o.depth]
    .map(function(regex){ return regex.source; }).join('|'), o.flag);

  return this;
};

parse.get = function(path, o){
  if(!o.input){ this.boil('#get')(path, o); }
  if(o.depth === null){ return null; }
  o.path = ''; o.index = 0;
  o.regexp = this.cache.regexp[o.depth];
  while(!o.regexp[o.index].test(path)){ o.index++; }
  o.path = this.cache.paths[o.depth][o.index];
  o.regexp = this.cache.regexp[o.depth][o.index];

  var param = path.match(o.regexp).slice(1);
  o.index = 0; o.notFound = false; o.params = { };
  o.notFound = Boolean(o.path.replace(/\:(\w+)/g, function($0, $1){
    return (o.params[$1] = param[o.index++]);
  }).replace(path.replace(o.query,'').replace(o.hash, ''), ''));

  param = null; // wipe
  ;['index', 'depth'].forEach(function(prop){ delete o[prop]; });
  return o;
};

parse._ = Object.keys(parse);
