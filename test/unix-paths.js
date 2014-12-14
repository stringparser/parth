'use strict';

var should = require('should');
var use, input, args, result;

module.exports = function(Parth){
  var parth = new Parth();

  use = 'unix paths';
  it('should handle '+use, function(){
    args = '/hello/awesome/human';
    input = '/hello/:there/:you';
    result = parth.set(input).get(args);
    should(result.input).be.eql(args);
    should(result.path).be.eql(input);
    should(result.params).be.eql({
      _: ['awesome', 'human'],
      there : 'awesome',
      you: 'human'
    });
  });
};
