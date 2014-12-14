'use strict';

var should = require('should');
var use, input, args, result;

module.exports = function(Parth){
  var parth = new Parth();

  use = 'urls and spaces';
  it('should handle '+use, function(){
    args = 'get /hello/awesome/human?query#hash';
    input = ':method(get) /hello/:there/:you';
    result = parth.set(input).get(args);
    should(result.input).be.eql(args);
    should(result.path).be.eql(input);
    should(result.url).have.properties({
      href : '/hello/awesome/human?query#hash',
      hash: '#hash',
      query: 'query',
      pathname: '/hello/awesome/human'
    });

    args = args.replace(/^get/, 'delete');
    should(parth.get(args)).be.eql(null);
  });
  use = 'urls spaces and object paths';
  it('should handle '+use, function(){
    args = 'post /hello/awesome/human/?query=and#hash-here page.user';
    input = ':method(get|post) /hello/:there/:you page.:data';
    result = parth.set(input).get(args);
    should(result.input).be.eql(args);
    should(result.path).be.eql(input);
    should(result.url).have.properties({
      href : '/hello/awesome/human/?query=and#hash-here',
      hash: '#hash-here',
      query: 'query=and',
      pathname: '/hello/awesome/human'
    });

    args = args.replace(/^post/, 'delete');
    should(parth.get(args)).be.eql(null);
  });
};
