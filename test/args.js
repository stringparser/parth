'use strict';

var should = require('should');
var use, input, args, result;

module.exports = function(Parth, util){
  should.exists(util);
  var parth = Parth();

  use = 'string args for #set and #get';
  it('should handle '+use, function(){
    input = 'hey :there :you';
    args = 'hey string person';
    result = parth.set(input).get(args);
    should(result.input).be.eql('hey string person');
    should(result.path).be.eql('hey :there :you');
    should(result.params).be.eql({
      there : 'string',
      you: 'person'
    });
  });

  use = 'array args for #set and #get';
  it('should handle '+use, function(){
    input = 'hey :there :you'.split(/[ ]+/);
    args = 'hey human string'.split(/[ ]+/);
    result = parth.set(input).get(args);
    should(result.input).be.eql('hey human string');
    should(result.path).be.eql('hey :there :you');
    should(result.params).be.eql({
      there : 'human',
      you: 'string'
    });
  });

  use = 'array args for #set string for #set';
  it('should handle '+use, function(){
    input = 'hey :there :you'.split(/[ ]+/);
    args = 'hey string robot';
    result = parth.set(input).get(args);
    should(result.input).be.eql('hey string robot');
    should(result.path).be.eql('hey :there :you');
    should(result.params).be.eql({
      there : 'string',
      you: 'robot'
    });
  });

  use = 'string args for #set array for #get';
  it('should handle '+use, function(){
    input = 'hey :there :you';
    args = 'hey array bat'.split(/[ ]+/);
    result = parth.set(input).get(args);
    should(result.input).be.eql('hey array bat');
    should(result.path).be.eql('hey :there :you');
    should(result.params).be.eql({
      there : 'array',
      you: 'bat'
    });
  });
};
