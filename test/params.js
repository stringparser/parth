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

  it('parameters can be given as a regexp', function(){
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

  it('urls spaces and object paths', function(){
    stems = ':method(post|get) /hello/:there/:you page.:data';
    path = 'post /hello/awesome/10.10 page.user';
    parth.set(stems);
    regex = parth.get(path, (o = { }));
    o.path.should.be.eql(path.replace(/\/?\?[^ ](|$)/g, ''));
    regex.path.should.be.eql(stems);
    o.params.should.be.eql({
      _ : ['method', 'there', 'you', 'data'],
      method: 'post',
      there: 'awesome',
      you: '10.10',
      data: 'user'
    });
  });
};
