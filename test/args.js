'use strict';

var should = require('should');
var use, stems, path, o, regex;

module.exports = function(Parth){
  var parth = new Parth();

  use = 'string args for #set and #get';

  it('should handle '+use, function(){
    stems = 'hey :there :you';
     path = 'hey string person';
    parth.set(stems);
    regex = parth.get(path, (o = { }));
    should(o.path).be.eql('hey string person');
    should(regex.path).be.eql('hey :there :you');
    should(o.params).be.eql({
      _ : ['there', 'you'],
      there : 'string',
      you: 'person'
    });
  });

  use = 'array args for #set and #get';
  it('should handle '+use, function(){
    stems = 'hey :there :you'.split(/[ ]+/);
    path = 'hey human string'.split(/[ ]+/);
    parth.set(stems);
    regex = parth.get(path, (o = { }));
    should(o.path).be.eql('hey human string');
    should(regex.path).be.eql('hey :there :you');
    should(o.params).be.eql({
      _ : ['there', 'you'],
      there : 'human',
      you: 'string'
    });
  });

  use = 'array args for #set string for #set';
  it('should handle '+use, function(){
    stems = 'hey :there :you'.split(/[ ]+/);
    path = 'hey string robot';
    parth.set(stems);
    regex = parth.get(path, (o = { }));
    should(o.path).be.eql('hey string robot');
    should(regex.path).be.eql('hey :there :you');
    should(o.params).be.eql({
      _ : ['there', 'you'],
      there : 'string',
      you: 'robot'
    });
  });

  use = 'string args for #set array for #get';
  it('should handle '+use, function(){
    stems = 'hey :there :you';
    path = 'hey array bat'.split(/[ ]+/);
    parth.set(stems);
    regex = parth.get(path, (o = { }));
    should(o.path).be.eql('hey array bat');
    should(regex.path).be.eql('hey :there :you');
    should(o.params).be.eql({
      _ : ['there', 'you'],
      there : 'array',
      you: 'bat'
    });
  });
};
