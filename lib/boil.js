'use strict';

var util = require('./util');

exports = module.exports = boil;

util.boilRE = /((?:\/|\?|\#)[^\/\?\# ]+|[^\. ]+\.)/g;
util.foldRE = new RegExp(util.boilRE.source + '(?:[ ]+|$)', 'g');

util.fold = function boilFold(stem){
  return stem.replace(util.foldRE, '$1').trim();
};

function boil(stem_, o){
  var stem = util.type(stem_);
  if(!stem.string && !stem.array){ return null; }
  o.input = util.fold(stem.string || stem.array.join(' '));
  o.stems = o.input.replace(util.boilRE, '$& ').trim().split(/[ ]+/);
  o.depth = o.stems.length-1;
}

//

boil.set = function boilSet(path, o){
  boil(path, o);
  o.found = this.cache.masterRE[o.depth];
  if(o.found && o.found.test(path)){ o = null; }
  delete o.found;
};

//

boil.get = function boilGet(path, o){
  boil(path, o);

  if(o.stems[o.depth][0] === '#'){
    o.hash = o.stems.pop();
    o.depth--;
  }

  if(o.stems[o.depth][0] === '?'){
    o.querystring = o.stems.pop();
    o.depth--;
  }

  o.found = this.cache.masterRE;
  if(o.depth > o.found.length-1){ o.depth = o.found.length; }
  o.index = o.depth;
  while(o.index > -1){
    if(o.found[o.index] && o.found[o.index].test(path)){
      o.depth = o.index; o.index = -1;
    } else if(!o.index){ o.depth = null; }
    o.index--;
  }
  delete o.found;
};

//

boil._ = Object.keys(boil);
