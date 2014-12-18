'use strict';

var should = require('should');
var use, stems, path, result;

module.exports = function(Parth){
  var parth = new Parth();

  use = 'unix paths';
  it('should handle '+use, function(){
    stems = '/hello/:there/:you';
    path = '/hello/awesome/human';
    parth.set(stems);
    parth.get(path, (result = { }));
    should(result.path).be.eql(path);
    should(result.regex.path).be.eql(stems);
    should(result.params).be.eql({
      _: ['awesome', 'human'],
      there : 'awesome',
      you: 'human'
    });
  });
};
