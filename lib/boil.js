'use strict';

var Url = require('url');
var util = require('./util');

exports = module.exports = boil;

var boilRE = /((?:\/|\?|\#)[^\/\?\# ]+|[^\. ]+\.)/g;
// var foldRE = new RegExp(boilRE.source + '(?:[ ]+|$)', 'g');

//function fold(stem){
//  return stem.replace(foldRE, '$1').trim();
//}

function boil(stem_, o){
  var stem = util.type(stem_);
  if(!stem.string && !stem.array){ return null; }
  o.input = (stem.string || stem.array.join(' ')).trim();
  o.stems = o.input.replace(boilRE, '$& ').split(/[ ]+/);
  o.index = 0;
  o.depth = o.stems.length-1;
  o.path = '';

  var url;
  if((url = o.input.match(/\/\S+/))){
    url = Url.parse(url[0]);
    if(url.query){ o.querystring = '?' + url.query; }
    if(url.hash){ o.hash = url.hash; }
    url = null;
  }

  o.input = o.input.replace(/[ ]+/g, ' ').trim();
  return o;
}
