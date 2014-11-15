'use strict';

var should = require('should');
var use, input, args, result;

module.exports = function(Parth, util){
  should.exists(util);
  use = 'sentences';
  var parth = Parth();
  use = 'unix absolute paths';
  it('should handle '+use, function(){
    args = '/hello/awesome/human';
    input = '/hello/:there/:you';
    result = parth.set(input).get(args);
    should(result.input).be.eql(args);
    should(result.path).be.eql(input);
  });
  use = 'unix relative paths';
  it('should handle '+use, function(){
    args = 'hello/awesome/human';
    input = 'hello/:there/:you';
    result = parth.set(input).get(args);
    should(result.input).be.eql(args);
    should(result.path).be.eql(input);
  });
};
