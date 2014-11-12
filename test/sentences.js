'use strict';

var should = require('should');
var use, input, args, result;
module.exports = function(poke, util){
  should.exists(util);
  it('should handle sentence paths', function(){
    use = 'sentences';
    args = (function(){ return arguments; })('awesome', 'human');
    input = 'you are an :there :you';
    result = poke(input, args);
    should(result.path).be.eql('you are an awesome human');
  });
};
