'use strict';

var should = require('should');
var use, input, args, result;

module.exports = function(Parth, util){
  should.exists(util);
  use = 'sentences';
  var parth = Parth();
  use = 'urls and spaces';
  it('should handle '+use, function(){
    args = 'get /hello/awesome/human?query#hash';
    input = ':method(get) /hello/:there/:you';
    result = parth.set(input).get(args);
    should(result.input).be.eql(args);
    should(result.path).be.eql(input);
    should(result.querystring).be.eql('?query');
    should(result.hash).be.eql('#hash');
    should(result.params).be.eql({
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
      method: 'get',
      there: 'awesome',
      you: 'human',
      data: 'user'
    });

    args = args.replace(/^get/, 'delete');
    should(parth.get(args)).be.eql(null);
  });
};
