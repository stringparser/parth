'use strict';

var should = require('should');
var use, input, args, result;

module.exports = function(Parth, util){
  should.exists(util);
  use = 'sentences';
  var parth = Parth();
  use = 'unix and spaces';
  it('should handle '+use, function(){
    args = 'get /hello/awesome/human';
    input = ':method:get /hello/:there/:you';
    result = parth.set(input).get(args);
    should(result.input).be.eql(args);
    should(result.path).be.eql(input);

    args = args.replace(/^get/, 'delete');
    should(parth.get(args)).be.eql(null);
  });
  use = 'unix relative and spaces';
  it('should handle '+use, function(){
    args = 'get /hello/awesome/human';
    input = ':method:get /hello/:there/:you';
    result = parth.set(input).get(args);
    should(result.input).be.eql(args);
    should(result.path).be.eql(input);
    
    args = args.replace(/^get/, 'delete');
    should(parth.get(args)).be.eql(null);
  });
};
