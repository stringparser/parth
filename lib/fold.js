'use strict';

exports = module.exports = foldPath;

var foldRE = /((?:\/|\?|\#)[^\/\?\# ]+)[ ]+/g;

function foldPath(stem){
  var depth, path = stem.replace(/(\.)[ ]+/g, '$1');
  if((depth = (path.match(foldRE) || [ ]).length)){
    path = path.replace(foldRE, function($0, $1){
      if(--depth){ return $1; }
      else{ return $0; }
    });
  }
  return path.trim();
}
