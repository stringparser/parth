'use strict';

var stem, path, o, regex;

module.exports = function(Parth){
  var parth = new Parth();

  it('can be given as a string regex', function(){
    stem = 'post /:number(\\d+)';
    path = 'post /1/?query';
    parth.set(stem);
    regex = parth.get(path, (o = { }));

    o.path.should.be.eql(path.replace(/\/\?[^ ]+/, ''));
    regex.path.should.be.eql(stem);
  });

  it('will contain all parameter keys at _', function(){
    stem = 'post /:word(\\w+)/:number(\\d+)';
    path = 'post /page/1/?query';
    parth.set(stem);
    parth.get(path, (o = { }));
    o.params._.should.be.eql(['word', 'number']);
  });

  it('do not have to contain a label', function(){
    stem = '(get|post) /hello/:there/:you';
    path = 'post /hello/awesome/10/?query#hash';
    parth.set(stem);
    regex = parth.get(path, (o = { }));

    o.path.should.be.eql(path.replace(/\/\?[^ ]+/, ''));
    regex.path.should.be.eql(stem);
    regex.stem.should.be.eql(':0'+stem);

    o.params.should.be.eql({
      '0': 'post',
      _ : ['0', 'there', 'you'],
      there: 'awesome',
      you: '10'
    });
  });

  it('parameter labels should be at params', function(){
    stem = ':method(get|post) /page/:there/:you';
    path = 'post /page/awesome/10/?query#hash';
    parth.set(stem);
    regex = parth.get(path, (o = { }));

    o.path.should.be.eql(path.replace(/\/\?[^ ]+/, ''));
    regex.path.should.be.eql(stem);

    o.params.should.be.eql({
      _ : ['method', 'there', 'you'],
      method: 'post',
      there: 'awesome',
      you: '10'
    });
  });
};
