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

  if(o && o.argv){ return o.argv; }
  p = util.type(p); o = o || { };
  if(!p.match(/string|array/)){ return null; }

  if(p.array){
    o.path = ''; o.argv = [ ];
    p.array.forEach(function(elem){
      var type = typeof elem;
      if(!(/string|function/).test(type)){ 
        return o.argv.push(elem);
      }
      if(type.length > 6){ // 'string'.length < 'function'.length
        type = elem.name || elem.displayName || 'anonymous';
        o.path += '[Function:'+ type +'] ';
        return o.argv.push(elem);
      }
      o.path += elem + ' ';
      elem = elem.replace(util.boilRE, '$& ').trim().split(/[ ]+/);
      o.argv = o.argv.concat(elem);
    });
  }

  // fold the path
  o.path = util.fold(p.string || o.path);

  // save url so it can be parsed; trim it afterwards
  if((o.url = o.path.match(/\/\S*/))){
    o.url = o.url[0];
    o.path = o.path.replace(o.url,
      o.url.replace(util.stripUrlRE, '') || '/');
  }

  o.argv = o.argv || o.path.replace(util.boilRE, '$& ').trim().split(/[ ]+/);
  return o.argv;
}
