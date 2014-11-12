'use strict';

var should = require('should');
var use, input, args, result;
module.exports = function(poke, util){
  should.exists(util);
  use = 'string args';
  it('should handle '+use, function(){
    args = 'string';
    input = 'hey :there';
    result = poke(input, args);
    should(result.path).be.eql('hey string');
  });
  use = 'array args';
  it('should handle '+use, function(){
    args = ['array', 'thing'];
    input = 'hey :there :you';
    result = poke(input, args);
    should(result.path).be.eql('hey array thing');
  });
  use = 'object args';
  it('should handle '+use, function(){
    args = {there: 'object', you: 'thing'};
    input = 'hey :there :you';
    result = poke(input, args);
    should(result.path).be.eql('hey object thing');
  });
  use = 'arguments args';
  it('should handle '+use, function(){
    args = (function(){ return arguments; })('arguments', 'thing');
    input = 'hey :there :you';
    result = poke(input, args);
    should(result.path).be.eql('hey arguments thing');
  });
};
