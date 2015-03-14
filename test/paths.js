'use strict';

var stems, path, o, regex;

module.exports = function(Parth){
  var parth = new Parth();

  it('object', function(){
    stems = 'hello.:there';
    path = 'hello.awesome';
    parth.add(stems);
    regex = parth.match(path, (o = { }));
    o.path.should.be.eql(path);
    regex.path.should.be.eql(stems);
  });

  it('raw object paths', function(){
    stems = 'hello.there';
    path = 'hello.there';
    parth.add(stems);
    regex = parth.match(path, (o = { }));
    o.path.should.be.eql(path);
    regex.path.should.be.eql(stems);
  });

  it('unix paths', function(){
    stems = '/hello/:there/:you';
    path = '/hello/awesome/human';
    parth.add(stems);
    regex = parth.match(path, (o = { }));
    o.path.should.be.eql(path);
    regex.path.should.be.eql(stems);
  });

  it('raw unix paths', function(){
    stems = '/hello/there/you';
    path = '/hello/there/you?here';
    parth.add(stems);
    regex = parth.match(path, (o = { }));
    o.path.should.be.eql(path.replace(/\/?\?[^ ]+/,''));
    regex.path.should.be.eql(stems);
  });

  it('urls', function(){
    stems = '/hello/:there';
    path = '/hello/awesome/?query';
    parth.add(stems);
    regex = parth.match(path, (o = { }));
    o.path.should.be.eql(path.replace(/\/?\?[^ ]+/,''));
    regex.path.should.be.eql(stems);
  });

  it('raw urls', function(){
    stems = '/hello/there';
    path = '/hello/there/?query';
    parth.add(stems);
    regex = parth.match(path, (o = { }));
    regex.path.should.be.eql(stems);
  });

  it('urls: querystring is stripped', function(){
    stems = 'get page.thing /hello/there';
    path = 'get page.thing /hello/there/?query';
    parth.add(stems);
    regex = parth.match(path, (o = { }));
    o.path.should.be.eql(path.replace(/\/?\?[^ ]+/,''));
    regex.path.should.be.eql(stems);
  });

  it('urls: hash is stripped', function(){
    stems = 'get page.thing /hello/there';
    path = 'get page.thing /hello/there#hello';
    parth.add(stems);
    regex = parth.match(path, (o = { }));
    o.path.should.be.eql(path.replace(/\/?[?#][^ ]+/,''));
    regex.path.should.be.eql(stems);
  });

  it('urls: parameters are not mistaken as querystrings', function(){
    stems = 'get page.thing /hello/:here(?:hello(?!there(?=you)))';
    path = 'get page.thing /hello/helloyou';
    parth.add(stems);
    regex = parth.match(path, (o = { }));
    o.path.should.be.eql(path.replace(/\/?[?#][^!:= ]+/,''));
    regex.path.should.be.eql(stems);
  });

  it('space separated paths', function(){
    path = 'you are an awesome human';
    stems = 'you are an :there :you';
    parth.add(stems);
    regex = parth.match(path, (o = { }));
    o.path.should.be.eql(path);
    regex.path.should.be.eql(stems);
  });

  it('raw, space separated paths', function(){
    path = 'you are an there you';
    stems = 'you are an there you';
    parth.add(stems);
    regex = parth.match(path, (o = { }));
    o.path.should.be.eql(path);
    regex.path.should.be.eql(stems);
  });

  it('unix, object and url paths together', function(){
    stems = 'get page.:thing /hello/:there';
    path = 'get page.data /hello/awesome/?query';
    parth.add(stems);
    regex = parth.match(path, (o = { }));
    o.path.should.be.eql(path.replace(/\/?\?[^ ]+/,''));
    regex.path.should.be.eql(stems);
  });

  it('raw: unix, object and urls paths together', function(){
    stems = 'get page.thing /hello/there';
    path = 'get page.thing /hello/there/?query';
    parth.add(stems);
    regex = parth.match(path, (o = { }));
    o.path.should.be.eql(path.replace(/\/?\?[^ ]+/,''));
    regex.path.should.be.eql(stems);
  });
};
