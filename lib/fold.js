'use strict';

var util = require('./util');

exports = module.exports = foldPath;

util.foldRE = /((?:[ ]+)(?:\/|\?|\#)[^\/\?\# ]+)/g;

function foldPath(stem){
  var notFirst;
  return stem.replace(/(\.)[ ]+/g, '$1')
      .replace(util.foldRE, function($0, $1){
        if(notFirst){ return $1.trim(); }
        notFirst = true;
        return $0;
      });
}
