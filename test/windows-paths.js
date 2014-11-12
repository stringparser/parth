'use strict';

var should = require('should');
var use, input, args, result;

module.exports = function(poke, util){
  should.exists(util);
  use = 'windows absolute paths';
  it('should handle '+use, function(){
    args = ['awesome', 'human'];
    input = 'C:\\hello\\:there\\:you';
    result = poke(input, args);
    should(result.path).be.eql('C:\\hello\\awesome\\human');
  });
  use = 'windows relative paths';
  it('should handle '+use, function(){
    args = ['awesome', 'human'];
    input = 'hello\\:there\\:you';
    result = poke(input, args);
    should(result.path).be.eql('hello\\awesome\\human');
  });
};
