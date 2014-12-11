'use strict';

exports = module.exports = fold;

var foldRE = /((?:\/|\?|\#)[^\/\?\# ]+)[ ]+/g;

function fold(stem){
  var depth, stems = stem.replace(/(\.)[ ]+/g, '$1');
  if((depth = (stem.match(foldRE) || [ ]).length)){
    stems = stems.replace(foldRE, function($0, $1){
      if(--depth){ return $1; }
      else{ return $0; }
    });
  }
  return stems;
}
