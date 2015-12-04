'use strict';

var stem, path, result;

module.exports = function(Parth){
  var parth = new Parth();

  it('object', function(){
    stem = 'hello.:there';
    path = 'hello.awesome';
    result = parth.set(stem).get(path);
    result.path.should.be.eql(path);
    result.stem.should.be.eql(stem);
  });

  it('raw object paths', function(){
    stem = 'hello.there';
    path = 'hello.there';
    result = parth.set(stem).get(path);
    result.path.should.be.eql(stem);
  });

  it('unix paths', function(){
    stem = '/hello/:there/:you';
    path = '/hello/awesome/human';
    result = parth.set(stem).get(path);
    result.path.should.be.eql(path);
    result.stem.should.be.eql(stem);
  });

  it('raw unix paths', function(){
    stem = '/hello/there/you';
    path = '/hello/there/you?here';
    result = parth.set(stem).get(path);
    result.path.should.be.eql(path.split('?')[0]);
  });

  it('urls', function(){
    stem = '/hello/:there';
    path = '/hello/awesome/?query';
    result = parth.set(stem).get(path);
    result.stem.should.be.eql(stem);
    result.path.should.be.eql(path.split('/?')[0]);
  });

  it('raw urls', function(){
    stem = '/hello/there';
    path = '/hello/there/?query';
    result = parth.set(stem).get(path);
    result.path.should.be.eql(path.split('/?')[0]);
  });

  it('urls: querystring is stripped', function(){
    stem = 'get page.thing /hello/there';
    path = 'get page.thing /hello/there/?query';
    result = parth.set(stem).get(path);
    result.path.should.be.eql(path.split('/?')[0]);
  });

  it('urls: hash is stripped', function(){
    stem = 'get page.thing /hello/there';
    path = 'get page.thing /hello/there#hello';
    result = parth.set(stem).get(path);
    result.path.should.be.eql(path.split('#')[0]);
  });

  it('urls: parameters are not mistaken as querystrings', function(){
    stem = 'get page.thing /hello/:here(?:\\w+you)';
    path = 'get page.thing /hello/helloyou';
    result = parth.set(stem).get(path);
    result.stem.should.be.eql(stem);
    result.path.should.be.eql(path);
  });

  it('space separated paths', function(){
    path = 'you are an awesome human';
    stem = 'you are an :there :you';
    result = parth.set(stem).get(path);
    result.stem.should.be.eql(stem);
    result.path.should.be.eql(path);
  });

  it('raw, space separated paths', function(){
    path = 'you are an there you';
    stem = 'you are an there you';
    result = parth.set(stem).get(path);
    result.path.should.be.eql(path);
  });

  it('unix, object and url paths together', function(){
    stem = 'get page.:thing /hello/:there';
    path = 'get page.data /hello/awesome/?query';
    result = parth.set(stem).get(path);
    result.stem.should.be.eql(stem);
    result.path.should.be.eql(path.split('/?')[0]);
  });

  it('raw: unix, object and urls paths together', function(){
    stem = 'get page.thing /hello/there';
    path = 'get page.thing /hello/there/?query';
    result = parth.set(stem).get(path);
    result.path.should.be.eql(path.split('/?')[0]);
  });

  after(function(){
    if(process.argv.indexOf('-l') < 0){ return; }
    Object.keys(parth.result).forEach(function(prop){
      var print = parth.result[prop];
      console.log('parth.result[%s]', prop);
      if(prop === 'master'){
        print = print.source.split(/\|(?=\({1,2})/);
      }
      console.log(print);
      console.log(' --\n');
    });
  });

};
