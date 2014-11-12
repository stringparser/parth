'use strict';

var should = require('should');
var use, input, args, result;
module.exports = function(poke, util){
  should.exists(util);
  use = 'composing (side by side tokens)';
  it('should handle '+use, function(){
    args = ['kick', 'ass', 'human'];
    input = 'hey :there:you :person';
    result = poke(input, args);
    should(result.path).be.eql('hey kickass human');
  });
};
