'use strict';

var path, match, result;

module.exports = function(Parth){
  var parth = new Parth();

  it('object', function(){
    path = 'hello.:there';
    match = 'hello.awesome';
    result = parth.set(path).get(match);
    result.should.have.properties({
      path: path,
      match: match
    });
  });

  it('raw object paths', function(){
    match = path = 'hello.there';
    result = parth.set(path).get(match);
    result.should.have.properties({
      path: path,
      match: match
    });
  });

  it('unix paths', function(){
    path = '/hello/:there/:you';
    match = '/hello/awesome/human';
    result = parth.set(path).get(match);
    result.should.have.properties({
      path: path,
      match: match
    });
  });

  it('raw unix paths', function(){
    path = '/hello/there/you';
    match = '/hello/there/you?here';
    result = parth.set(path).get(match);
    result.should.have.properties({
      path: path,
      match: match
    });
  });

  it('urls', function(){
    path = '/hello/:there';
    match = '/hello/awesome/?query';
    result = parth.set(path).get(match);
    result.should.have.properties({
      path: path,
      match: match
    });
  });

  it('raw urls', function(){
    path = '/hello/there';
    match = '/hello/there/?query';
    result = parth.set(path).get(match);
    result.should.have.properties({
      path: path,
      match: match
    });
  });

  it('urls: querystring is stripped', function(){
    path = 'get page.thing /hello/there';
    match = 'get page.thing /hello/there/?query';
    result = parth.set(path).get(match);
    result.should.have.properties({
      path: path,
      match: match
    });
  });

  it('urls: hash is stripped', function(){
    path = 'get page.thing /hello/there';
    match = 'get page.thing /hello/there#hello';
    result = parth.set(path).get(match);
    result.should.have.properties({
      path: path,
      match: match
    });
  });

  it('urls: parameters are not mistaken as querystrings', function(){
    path = 'get page.thing /hello/:here(?:\\w+you)';
    match = 'get page.thing /hello/helloyou';
    result = parth.set(path).get(match);
    result.should.have.properties({
      path: path,
      match: match
    });
  });

  it('space separated paths', function(){
    path = 'you are an :there :you';
    match = 'you are an awesome human';
    result = parth.set(path).get(match);
    result.should.have.properties({
      path: path,
      match: match
    });
  });

  it('raw, space separated paths', function(){
    match = path = 'you are an there you';
    result = parth.set(path).get(match);
    result.should.have.properties({
      path: path,
      match: match
    });
  });

  it('unix, object and url paths together', function(){
    path = 'get page.:thing /hello/:there';
    match = 'get page.data /hello/awesome/?query';
    result = parth.set(path).get(match);
    result.should.have.properties({
      path: path,
      match: match
    });
  });

  it('raw: unix, object and urls paths together', function(){
    path = 'get page.thing /hello/there';
    match = 'get page.thing /hello/there/?query';
    result = parth.set(path).get(match);
    result.should.have.properties({
      path: path,
      match: match
    });
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
