'use strict';

var stem, path, result;

module.exports = function(Parth){
  var parth = new Parth();

  it('can be given as part of the input string', function(){
    stem = 'post /:number(\\d+)';
    path = 'post /1/?query';
    result = parth.set(stem).get(path);
    result.stem.should.be.eql(stem);
    result.path.should.be.eql(path.split('/?')[0]);
    result.params.should.be.eql({
      _: ['number'],
      number: '1'
    });
  });

  it('will contain all parameter keys at _', function(){
    stem = 'post /:word(\\w+)/:number(\\d+)';
    path = 'post /page/1/?query';
    result = parth.set(stem).get(path);
    result.stem.should.be.eql(stem);
    result.path.should.be.eql(path.split('/?')[0]);
    result.params._.should.be.eql(['word', 'number']);
  });

  it('may not have contain labels', function(){
    stem = '(get|post) /hello/:there/:you';
    path = 'post /hello/awesome/10/?query#hash';
    result = parth.set(stem).get(path);
    result.path.should.be.eql(path.split('/?')[0]);
    result.stem.should.be.eql(':0' + stem);
    result.params.should.be.eql({
        _: ['0', 'there', 'you'],
      '0': 'post',
      you: '10',
      there: 'awesome'
    });
  });

  it('parameter labels should be at params', function(){
    stem = ':method(get|post) /page/:there/:you';
    path = 'post /page/awesome/10/?query#hash';
    result = parth.set(stem).get(path);
    result.path.should.be.eql(path.split('/?')[0]);
    result.stem.should.be.eql(stem);
    result.params.should.be.eql({
      _: ['method', 'there', 'you'],
      you: '10',
      there: 'awesome',
      method: 'post'
    });
  });
};
