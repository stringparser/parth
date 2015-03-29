'use strict';

var stems, path, o, regex;

module.exports = function(Parth){
  var parth = new Parth();

  it('can be given as a string regex', function(){
    stems = 'post /:number(\\d+)';
    path = 'post /1/?query';
    parth.set(stems);
    regex = parth.get(path, (o = { }));

    o.path.should.be.eql(path.replace(/\/\?[^ ]+/, ''));
    regex.path.should.be.eql(stems);
  });

  it('will contain all parameter keys at _', function(){
    stems = 'post /:word(\\w+)/:number(\\d+)';
    path = 'post /page/1/?query';
    parth.set(stems);
    parth.get(path, (o = { }));
    o.params._.should.be.eql(['word', 'number']);
  });

  it('do not have to contain a label', function(){
    stems = '(get|post) /hello/:there/:you';
    path = 'post /hello/awesome/10/?query#hash';
    parth.set(stems);
    regex = parth.get(path, (o = { }));

    o.path.should.be.eql(path.replace(/\/\?[^ ]+/, ''));
    regex.path.should.be.eql(':0'+stems);

    o.params.should.be.eql({
      '0': 'post',
      _ : ['0', 'there', 'you'],
      there: 'awesome',
      you: '10'
    });
  });

  it('parameter labels should be at params', function(){
    stems = ':method(get|post) /hello/:there/:you';
    path = 'post /hello/awesome/10/?query#hash';
    parth.set(stems);
    regex = parth.get(path, (o = { }));

    o.path.should.be.eql(path.replace(/\/\?[^ ]+/, ''));
    regex.path.should.be.eql(stems);

    o.params.should.be.eql({
      _ : ['method', 'there', 'you'],
      method: 'post',
      there: 'awesome',
      you: '10'
    });
  });
};
