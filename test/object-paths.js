'use strict';

var should = require('should');
var use, input, args, result;

module.exports = function(Parth){
  var parth = new Parth();

  use = 'object paths';
  it('should handle object paths', function(){
    args = 'hello.awesome.human';
    input = 'hello.:there.:you';
    result = parth.set(input).get(args);
    should(result.input).be.eql(args);
    should(result.path).be.eql(input);
  });

  it('should handle object paths with regexes', function(){
    args = 'hello.1.human';
    input = 'hello.:there(\\d+).:you';
    result = parth.set(input).get(args);
    should(result.input).be.eql(args);
    should(result.path).be.eql(input);
  });
};
