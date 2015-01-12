'use strict';

var should = require('should');
var use, stems, path, o, regex;

module.exports = function(Parth){
  var parth = new Parth();

  use = 'space separated strings';
  it('should handle '+use, function(){
    path = 'you are an awesome human';
    stems = 'you are an :there :you';
    parth.set(stems);
    regex = parth.get(path, (o = { }));
    should(o.path).be.eql('you are an awesome human');
    should(regex.path).be.eql('you are an :there :you');
    should(o.params).be.eql({
      _ : ['there', 'you'],
      there : 'awesome',
      you: 'human'
    });
  });
};
