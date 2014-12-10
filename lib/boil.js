'use strict';

var util = require('./util');

exports = module.exports = boil;

util.boilRE = /((?:\/|\?|\#)[^\/\?\# ]+|[^\. ]+\.)/g;

function boil(stem_){
  var stem = util.type(stem_);
  if(!stem.string && !stem.array){ return null; }
  return (stem.string || stem.array.join(' '))
    .replace(util.boilRE, '$& ').trim().split(/[ ]+/);
}

//
util.foldRE = new RegExp(util.boilRE.source + '(?:[ ]+|$)', 'g');

boil.fold = function boilFold(stem){
  return stem.replace(util.foldRE, '$1').trim();
};

//

boil.set = function boilSet(stem, o){
  o.stems = boil(stem);
  o.depth = o.stems.length-1;
  o.masterRE = this.cache.masterRE[o.depth] || null;
  if(!o.masterRE){ return o.stems; }
  else if(o.masterRE.test(stem)){ return null; }
  return o.stems;
};

//

boil.get = function boilGet(stem, o){
  o.stems = boil(stem);
  o.depth = o.stems.length-1;
  o.found = this.cache.masterRE;

  if(o.stems[o.depth][0] === '#'){
    o.hash = o.stems.pop();
    o.depth--;
  }

  if(o.stems[o.depth][0] === '?'){
    o.query = o.stems.pop();
    o.depth--;
  }

  if(o.depth > o.found.length-1){ o.depth = o.found.length; }
  o.index = o.depth;

  while(o.index > -1){
    if(o.found[o.index] && o.found[o.index].test(stem)){
      o.depth = o.index; o.index = -1;
    } else if(!o.index){ o.depth = null; }
    o.index--;
  }

  delete o.found;
  return o.stems;
};

//

boil._ = Object.keys(boil);
