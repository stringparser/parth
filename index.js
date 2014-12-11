'use strict';

var util = require('./lib/util');
util.boil = require('./lib/boil');
util.parse = require('./lib/parse');

exports = module.exports = Parth;

function Parth(){

  if( !(this instanceof Parth) ){
    return new Parth();
  }

  this.cache = { paths: [ ], regexp: [ ], masterRE: [ ]  };
  this.method = { _: {boil:[], parse:[]}, boil:{}, parse:{} };

  // default parsers
  util.parse._.forEach(function(method){
    this.parse('#' + method, util.parse[method]);
  }, this);
}

// ## Parth.set
// > premise: set is way to usual method for a prototype
//
// arguments
// `path` type `string` or `array`
// `opt` type `object` optional
//
// return
//  - `this` so the method is chainable
//
Parth.prototype.set = function(path, opt){
  return this.parse('#set')(path, opt || { });
};

// ## Parth.get
// > premise: get is way to usual method for a prototype
//
// arguments
// `path` type `string` or `array`
// `opt` type `object` optional
//
// return
//  - `output` type `object` with useful propeties
//
Parth.prototype.get = function(path, opt){
  return this.parse('#get')(path, opt || { });
};

// ## Parth.boil
// > premise: transform input to an array
// > have all extra information on opts
//
// arguments
//  - `prop` type `string`
//  - `boiler` type `function` optional
//
// return
//  - `boiler` function if arguments < 2
//  - `this` otherwise
//
Parth.prototype.boil = function(prop, boiler){
  if(arguments.length < 2){ return this.method.boil[prop] || util.boil; }
  if(typeof prop !== 'string'){
    prop = JSON.stringify(prop);
    throw new util.Error(
      ' While setting `'+prop+'` at this.boil(prop[, boiler]):\n' +
      ' > `prop` should be a string and, if given, `boiler` a function');
  }
  // add it to the list of boilers
  if(!this.method.boil[prop]){ this.method._.boil.push(prop); }

  var self = this;
  this.method.boil[prop] = function(stems, opts){
    stems = boiler.call(self, stems, opts);
    if(!stems){ return null; }
    if(util.type(stems).array){ return stems; }
    throw new util.Error(
      ' While boiling `'+prop+'` with boiler(stems, opts):\n'+
      ' > a boiler should return an array a falsy value');
  };

  return this;
};

// ## Parth.parse
// > premise: transform output to an object
// > have all extra information on opts
//
// arguments
// `prop` type `string`
// `parser` type `function` optional
//
// return
//  - `parser` function if arguments < 2
//  - `this` otherwise
//
Parth.prototype.parse = function(prop, parser){
  if(arguments.length < 2){ return this.method.parse[prop] || util.parse; }
  if(typeof prop !== 'string'){
    prop = JSON.stringify(prop);
    throw new util.Error(
      ' While setting `'+prop+'` at this.parse(prop[, parser]):\n' +
      ' > `prop` should be a string and, if given, `parser` a function');
  }
  // add it to the list of parsers
  if(!this.method.parse[prop]){ this.method._.parse.push(prop); }

  var self = this;
  this.method.parse[prop] = function(/* arguments */){
    var parsed = parser.apply(self, arguments);
    if(!parsed){ return null; }
    if(util.type(parsed).object){ return parsed; }
    throw new util.Error(
      ' While parsing `'+prop+'` \n'+
      ' parser.apply(self, arguments):\n'+
      ' > a parser should return an object or a falsy value');
  };

  return this;
};
