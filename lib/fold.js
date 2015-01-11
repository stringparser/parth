'use strict';

var util = require('./util');

exports = module.exports = foldPath;

util.foldRE = /((?:[ ]+)(?:\/|\?|\#)[^\/\?\# ]+)/g;

function foldPath(stem){
  stem = util.type(stem);
  if(!stem.array && !stem.string){ return null; }
  stem = (stem.string || stem.array.map(function(elem){
    if(typeof elem !== 'function'){ return elem; }
    return '[Function:' + (elem.name || elem.displayName || '') + ']';
  }).join(' '));

  var notFirst;
  return stem.replace(/(\.)[ ]+/g, '$1')
    .replace(util.foldRE, function($0, $1){
      if(notFirst){ return $1.trim(); }
      notFirst = true;
      return $0;
    });
}
