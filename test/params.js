'use strict';

var should = require('should');
var use, stems, path, o, regex;

module.exports = function(Parth, util){
  var parth = new Parth();
  var boil = util.pack.boil;
  var fold = util.pack.fold;

  use = 'urls and spaces';
  it('should handle '+use, function(){
    stems = ':method(get|post) /hello/:there/:you';
    path = 'post /hello/awesome/10/?query#hash';
    parth.set(stems);
    regex = parth.get(path, (o = { }));

    should(o.path).be.eql(fold(boil(path).join(' ')));
    should(regex.path).be.eql(stems);

    should(o.params).be.eql({
      _ : ['method', 'there', 'you'],
      method: 'post',
      there: 'awesome',
      you: 10
    });

    path = path.replace(/^post/, 'delete');
    should(parth.get(path)).be.eql(null);
  });
  use = 'urls spaces and object paths';
  it('should handle '+use, function(){
    stems = ':method(post|get) /hello/:there/:you page.:data';
    path = 'post /hello/awesome/10.10 page.user';
    parth.set(stems);
    regex = parth.get(path, (o = { }));
    should(o.path).be.eql(path.replace(/\/?\?[^ ](|$)/g, ''));
    should(regex.path).be.eql(stems);
    should(o.params).be.eql({
      _ : ['method', 'there', 'you', 'data'],
      method: 'post',
      there: 'awesome',
      you: 10.1,
      data: 'user'
    });

    path = path.replace(/^post/, 'delete');
    should(parth.get(path)).be.eql(null);
  });
};
