'use strict';

var should = require('should');
var use, input, args, result;

module.exports = function(Parth, util){
  should.exists(util);
  var parth = Parth();
  use = 'string args';
  it('should handle '+use, function(){
    input = 'hey :there :you';
    args = 'hey string person';
    result = parth.set(input).get(args);
    should(result.input).be.eql('hey string person');
    should(result.path).be.eql('hey :there :you');
  });
};
