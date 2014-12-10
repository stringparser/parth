'use strict';

var util = require('./util');

exports = module.exports = parse;

function parse(node, o){
  o = null; // wipe
  return node;
}

parse.set = function(path, o){
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
  o.regexp = util.boil.fold(o.stems.join(' '))
    .replace(/\S+/g, function(stem){
      o.sep = '([^\\'+ ((stem).match(/\//) || ['.'])[0] +' ]+)';
      return stem.replace(/(\:\w+)(\(.+?\))?/g, function($0, $1, $2){
        o.params[$1] = $2 || o.sep;
        return $1;
      });
    })
    .replace(/[ ]+/g, ' ')
    .replace(/[\/\.\?\#]+/g, '\\$&')
    .replace(/\:\w+/g, function($0){ return o.params[$0]; });

  o.sep = new RegExp(o.sep.replace('^', '') + '$');
  if(o.depth > 1 && o.sep.test(o.regexp)){ o.regexp += '?'; }

  o.flag = o.strict ? '' : 'i';
  o.regexp = new RegExp('^' + o.regexp, o.flag);

  var method = (/\(.+?\)/).test(o.input) ? 'unshift' : 'push';

  cache.paths[o.depth][method](o.stems.join(' '));
  cache.regexp[o.depth][method](o.regexp);
  cache.masterRE[o.depth] = new RegExp(cache.regexp[o.depth]
    .map(function(regex){ return regex.source; }).join('|'), o.flag);

  index = method = o = null; // wipe
  return this;
};

parse.get = function(path, o){
  o.index = o.depth;
  if(o.depth === null){ return null; }
  o.regexp = this.cache.regexp[o.depth];

  while(!o.regexp[o.index].test(o.input)){ o.index++; }
  o.path = this.cache.paths[o.depth][o.index];
  o.regexp = this.cache.regexp[o.depth][o.index];

  console.log('path -> '+ path);
  console.log('p', p);
  console.log('opt', o);
  console.log('cache', this.cache);
  console.log('\n -- \n');

  var copy = util.merge({ }, node);


  return util.merge(copy, o);
};

parse._ = Object.keys(parse);
