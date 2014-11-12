'use strict';

var type = require('utils-type');

exports = module.exports = {
  cache : {
    re : [ ],
    paths : [ ],
    masterRE : [ ],
  }
};
//
// ## best guess of the token separator
//    defaults to space
function tokenize(path, opt) {
  opt = opt || { }; var p = { };
  p.path = type(path).string || '';
  // separation token
  p.sep = type(opt).regexp ||
    (path.match(/(\\|\/)(?=[\/\\])|(\\|\/)/)
      || path.match(/\./) || '  ')[0];

  if( p.sep.trim() ){ p.sep = '\\' + p.sep; }

  // possible tokens
  p.tokens = type(p.tokens).regexp || new RegExp('['+
    p.sep.replace(/[\/\\]/, '\\$&\\#\\?') +
  ']+', 'g');

  // find depth out
  p.depth = p.path.split(p.tokens);
  p.depth = p.depth[0]
    ? p.depth.length
    : p.depth.length-1;

  // choose space as invariant, trim right
  p.parsed = p.path.replace(p.tokens, ' ')
    .replace(/[ ]+$/, '');

  return p;
}
exports.tokenize = tokenize;

//
// ## substitue parameters and return array
//
function getArgs(p){
  return p.parsed.replace(/\:\S+/g,
    function($0){  return p.params[$0.substring(1)];
  }).trim().split(/[ ]/);
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
