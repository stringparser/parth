'use strict';

var should = require('should');
var use, input, args, result;

module.exports = function(Parth){
  var parth = new Parth();

  use = 'urls and spaces';
  it('should handle '+use, function(){
    args = 'get /hello/awesome/human?query=here#hash';
    input = ':method(get) /hello/:there/:you';
    result = parth.set(input).get(args);
    should(result.input).be.eql(args);
    should(result.path).be.eql(input);
    should(result.params).be.eql({
      _ : ['get', 'awesome', 'human'],
      method: 'get',
      there: 'awesome',
      you: 'human'
    });

    args = args.replace(/^get/, 'delete');
    should(parth.get(args)).be.eql(null);
  });
  use = 'urls spaces and object paths';
  it('should handle '+use, function(){
    args = 'get /hello/awesome/human page.user';
    input = ':method(get) /hello/:there/:you page.:data';
    result = parth.set(input).get(args);
    should(result.input).be.eql(args);
    should(result.path).be.eql(input);
    should(result.params).be.eql({
      _ : ['get', 'awesome', 'human', 'user'],
      method: 'get',
      there: 'awesome',
      you: 'human',
      data: 'user'
    });

    args = args.replace(/^get/, 'delete');
    should(parth.get(args)).be.eql(null);
  });
};
