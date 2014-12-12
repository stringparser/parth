'use strict';

var should = require('should');
var use, input, args, result;

module.exports = function(Parth){
  var parth = new Parth();

  use = 'urls and spaces';
  it('should handle '+use, function(){
    args = 'get /hello/awesome/human?query#hash';
    input = ':method(get) /hello/:there';
    result = parth.set(input).get(args);
    should(result.input).be.eql(args);
    should(result.stems).be.eql(input);
    should(result.notFound).be.eql(true);
  });
  use = 'urls spaces and object paths';
  it('should handle '+use, function(){
    args = 'post /hello/awesome/human/?query=and#hash-here page.user';
    input = ':method(get|post) /hello/:there/:you';
    result = parth.set(input).get(args);
    should(result.input).be.eql(args);
    should(result.stems).be.eql(input);
    should(result.notFound).be.eql(false);

    args = args.replace(/^post/, 'delete');
    should(parth.get(args)).be.eql(null);
  });
};
