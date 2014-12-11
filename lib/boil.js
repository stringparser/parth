'use strict';

var util = require('./util');

exports = module.exports = boil;

var boilRE = /((?:\/|\?|\#)[^\/\?\# ]+|[^\. ]+\.)/g;
var foldRE = new RegExp(boilRE.source + '(?:[ ]+|$)', 'g');

function fold(stem){
  return stem.replace(foldRE, '$1').trim().replace(/[ ]+/g, ' ');
}

function boil(stem_, o){
  var stem = util.type(stem_);
  if(!stem.string && !stem.array){ return null; }
  o.input = fold(stem.string || stem.array.join(' '));
  o.stems = o.input.replace(boilRE, '$& ').trim().split(/[ ]+/);
  o.index = 0;
  o.depth = o.stems.length-1;
  o.path = '';

  if(o.stems[o.depth][0] === '#'){
    o.hash = o.stems.pop();
    o.depth--;
  }

  if(o.stems[o.depth][0] === '?'){
    o.querystring = o.stems.pop();
    o.depth--;
  }

  return o;
}
