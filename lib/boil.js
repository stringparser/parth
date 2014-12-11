'use strict';

var Url = require('url');
var util = require('./util');
var fold = require('./fold');

exports = module.exports = boil;

var boilRE = /((?:\/|\?|\#)[^\/\?\# ]+|[^\. ]+\.)/g;

function boil(stem_, o){
  var stem = util.type(stem_);
  if(!stem.string && !stem.array){ return null; }
  o.input = (stem.string || fold(stem.array.join(' ')));
  o.stems = o.input.replace(/[ ]+/, ' ').trim();
  o.index = 0;
  o.depth = 0;
  o.path = '';

  var url;
  if((url = o.input.match(/\/\S+/))){
    url = Url.parse(url[0]);
    if(url.query){ o.querystring = '?' + url.query; }
    if(url.hash){ o.hash = url.hash; }
    url = null;
    o.stems = o.stems.replace((o.querystring || '') + (o.hash || ''), '');
  }

  o.stems = o.stems.replace(boilRE, '$& ').split(/[ ]+/);
  o.depth = o.stems.length-1;
  return o.stems;
}
