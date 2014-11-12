'use strict';

exports = module.exports = {
  paramRE : /:\S+/g,
  cache : {
    re : [ ],
    paths : [ ],
    masterRE : [ ],
  }
};

//
// ## substitue parameters and return array
//
function getArgs(p){
  return p.parsed.replace(/\:\S+/g,
    function($0){
      var param = p.params[$0.substring(1)];
      if(!param){  return '';  }
      return param;
  }).replace(/[ ]/, ' ').trim().split(/[ ]/);
}
exports.getArgs = getArgs;

//
// ## sanitizes regexParameters :name:regex
//
function sanitizeParam(param){
  if(!param[1]){ return ; }
  param[1] = '(' + param[1].replace(/^\(|\)$/g,'') + ')';
}
exports.sanitizeParam = sanitizeParam;
