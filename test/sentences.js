'use strict';

var should = require('should');
var use, stems, path, o;

module.exports = function(Parth){
  var parth = new Parth();

  use = 'space separated strings';
  it('should handle '+use, function(){
    path = 'you are an awesome human';
    stems = 'you are an :there :you';
    parth.set(stems);
    parth.get(path, (o = { }));
    should(o.path).be.eql('you are an awesome human');
    should(o.regex.path).be.eql('you are an :there :you');
    should(o.params).be.eql({
      _ : ['awesome', 'human'],
      there : 'awesome',
      you: 'human'
    });
  });
};
