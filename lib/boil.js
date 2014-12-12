'use strict';

var util = require('./util');
util.fold = require('./fold');

exports = module.exports = boil;

var boilRE = /((?:\/|\?|\#)[^\/\?\# ]+|[^\. ]+\.)/g;

function boil(stem_, o){
  var stem = util.type(stem_);
  if(!stem.string && !stem.array){ return null; }
  o.input = (stem.string || util.fold(stem.array.join(' ')));
  o.path = o.input.replace(/[ ]+/g, ' ');
  o.stems = '';

  var url;
  if((url = o.path.match(/\/\S+/))){
    o.url = util.url.parse(url = url[0]);
    o.url = {
      href: url,
      hash: o.url.hash,
      query: o.url.query,
      pathname: url.replace(o.url.search + o.url.hash, ''),
    };
    o.path = o.path.replace(o.url.href,
      o.url.pathname.replace(/[\/]+$/, '') || '/');
  }

  o.stems = o.path.replace(boilRE, '$& ').trim().split(/[ ]+/);
  o.index = o.depth = o.stems.length-1;
  return o.stems;
}
