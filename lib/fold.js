'use strict';

var util = require('./util');

exports = module.exports = foldPath;

util.foldRE = /((?:[ ]+)(?:\/|\?|\#)[^\/\?\# ]+)/g;

function foldPath(p){
  var notFirst = null;
  return p.replace(/(\.)[ ]+/g, '$1')
    .replace(util.foldRE, function($0, $1){
      if(notFirst){ return $1.trim(); } notFirst = true;
      return $0;
    }).trim();
}
