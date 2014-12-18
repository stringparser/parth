'use strict';

var should = require('should');
var use, stems, path, result;

module.exports = function(Parth){
  var parth = new Parth();

  use = 'string args for #set and #get';

  it('should handle '+use, function(){
    stems = 'hey :there :you';
     path = 'hey string person';
    parth.set(stems);
    parth.get(path, (result = { }));
    should(result.path).be.eql('hey string person');
    should(result.regex.path).be.eql('hey :there :you');
    should(result.params).be.eql({
      _ : ['string', 'person'],
      there : 'string',
      you: 'person'
    });
  });

  use = 'array args for #set and #get';
  it('should handle '+use, function(){
    stems = 'hey :there :you'.split(/[ ]+/);
    path = 'hey human string'.split(/[ ]+/);
    parth.set(stems);
    parth.get(path, (result = { }));
    should(result.path).be.eql('hey human string');
    should(result.regex.path).be.eql('hey :there :you');
    should(result.params).be.eql({
      _ : ['human', 'string'],
      there : 'human',
      you: 'string'
    });
  });

  use = 'array args for #set string for #set';
  it('should handle '+use, function(){
    stems = 'hey :there :you'.split(/[ ]+/);
    path = 'hey string robot';
    parth.set(stems);
    parth.get(path, (result = { }));
    should(result.path).be.eql('hey string robot');
    should(result.regex.path).be.eql('hey :there :you');
    should(result.params).be.eql({
      _ : ['string', 'robot'],
      there : 'string',
      you: 'robot'
    });
  });

  use = 'string args for #set array for #get';
  it('should handle '+use, function(){
    stems = 'hey :there :you';
    path = 'hey array bat'.split(/[ ]+/);
    parth.set(stems);
    parth.get(path, (result = { }));
    should(result.path).be.eql('hey array bat');
    should(result.regex.path).be.eql('hey :there :you');
    should(result.params).be.eql({
      _ : ['array', 'bat'],
      there : 'array',
      you: 'bat'
    });
  });
};
