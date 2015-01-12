'use strict';

var should = require('should');
var use, stems, path, o, regex;

module.exports = function(Parth){
  var parth = new Parth();

  use = 'unix paths';
  it('should handle '+use, function(){
    stems = '/hello/:there/:you';
    path = '/hello/awesome/human/?#hash';
    parth.set(stems);
    regex = parth.get(path, (o = { }));
    should(o.path).be.eql(path.replace(/\/\?[^ ]+/, ''));
    should(regex.path).be.eql(stems);
    should(o.params).be.eql({
      _: ['there', 'you'],
      there : 'awesome',
      you: 'human'
    });
  });
};
