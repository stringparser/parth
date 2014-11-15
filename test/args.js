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
  use = 'array args';
  it('should handle '+use, function(){
    args = ['hey', 'array', 'thing'];
    result = parth.set(input).get(args);
    should(result.path).be.eql('hey :there :you');
    should(result.argv).be.eql(args);
    should(result.input).be.eql(args.join(' '));
  });
};
