'use strict';

var should = require('should');
var stems, path, o;

module.exports = function(Parth){
  var parth = new Parth();

  it('should handle object paths', function(){
    path = 'hello.awesome.human';
    stems = 'hello.:there.:you';
    parth.set(stems);
    parth.get(path, (o = { }));
    should(o.path).be.eql(path);
    should(o.regex.path).be.eql(stems);
  });

  it('should handle object paths with regexes', function(){
    path = 'hello.1.human';
    stems = 'hello.:there(\\d+).:you';
    parth.set(stems);
    parth.get(path, (o = { }));
    should(o.path).be.eql(path);
    should(o.regex.path).be.eql(stems);
  });
};
