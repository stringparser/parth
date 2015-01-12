'use strict';

var util = require('./util');
util.fold = require('./fold');

exports = module.exports = boil;

// ## boil(p [, o]) -> path, options
// > normalize a path
//
// arguments
//  - `p` type `string` or `array`
//  - `o` type `object` holding all extra information
//
// return
//  - `null` for non supported `p` types
//  - `o.argv` array with the normalized path
// --
// api.private
// --

util.boilRE = /((?:\/)[^\/ ]+|[^\. ]+\.)/g;
util.stripUrlRE = /(?:\/)?[?#]+[^: ]+$|\/$/g;

function boil(p, o){
  p = util.type(p);
  if(!p.match(/string|array/)){ return null; }

  o = o || { }; o.path = '';
  o.path = util.fold(p.string || p.array.map(function(elem){
    var type = typeof elem; o.argv = o.argv || [ ];
    if(!(/string|function/).test(type)){ o.argv.push(elem); return ''; }
    if(type.length > 6){ // 'function'.length < 'string'.length
      o.argv.push(elem);
      type = elem.path || elem.name || elem.displayName || '';
      return '[Function:'+ type +']';
    }
    type = elem.replace(util.boilRE, '$& ');
    o.argv = o.argv.concat(type.trim().split(/[ ]+/));
    return elem;
  }).join(' '));

  // save url so it can be parsed; trim it afterwards
  if((o.url = o.path.match(/\/\S*/))){
    o.url = o.url[0];
    o.path = o.path.replace(o.url,
      o.url.replace(util.stripUrlRE, '') || '/');
  }

  o.argv = o.argv || o.path.replace(util.boilRE, '$& ').trim().split(/[ ]+/);

  return o.argv;
}
