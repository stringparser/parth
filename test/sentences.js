'use strict';

var should = require('should');
var use, input, args, result;

module.exports = function(Parth, util){
  should.exists(util);
  use = 'sentences';
  var parth = Parth();
  it('should handle '+use, function(){
    args = 'you are an awesome human';
    input = 'you are an :there :you';
    result = parth.set(input).get(args);
    should(result.input).be.eql('you are an awesome human');
    should(result.path).be.eql('you are an :there :you');
  });
};
