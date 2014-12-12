'use strict';

var should = require('should');
var use, input, args, result;

module.exports = function(Parth){
  var parth = new Parth();

  use = 'urls and spaces';
  it('should handle '+use, function(){
    args = 'post /hello/awesome/10/?query#hash';
    input = ':method(get|post) /hello/:there/:you';
    result = parth.set(input).get(args);
    should(result.input).be.eql(args);
    should(result.stems).be.eql(input);

    should(result.params).be.eql({
      method: 'post',
      there: 'awesome',
      you: 10
    });

    args = args.replace(/^post/, 'delete');
    should(parth.get(args)).be.eql(null);
  });
  use = 'urls spaces and object paths';
  it('should handle '+use, function(){
    args = 'post /hello/awesome/10.10 page.user';
    input = ':method(post|get) /hello/:there/:you page.:data';
    result = parth.set(input).get(args);
    should(result.input).be.eql(args);
    should(result.stems).be.eql(input);
    should(result.params).be.eql({
      method: 'post',
      there: 'awesome',
      you: 10.1,
      data: 'user'
    });

    args = args.replace(/^post/, 'delete');
    should(parth.get(args)).be.eql(null);
  });
};
