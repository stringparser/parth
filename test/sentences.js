'use strict';

var should = require('should');
var use, input, args, result;

module.exports = function(Parth){
  var parth = new Parth();

  use = 'space separated strings';
  it('should handle '+use, function(){
    args = 'you are an awesome human';
    input = 'you are an :there :you';
    result = parth.set(input).get(args);
    should(result.input).be.eql('you are an awesome human');
    should(result.stems).be.eql('you are an :there :you');
    should(result.params).be.eql({
      there : 'awesome',
      you: 'human'
    });
  });
};
