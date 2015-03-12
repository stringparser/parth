'use strict';

var use, path, stems, ret, o, regex;

module.exports = function(Parth){
  var parth = new Parth();

  use = 'urls and spaces';
  it('should handle '+use, function(){
    stems = ':method(get) /hello/:there';
    path = 'get /hello/awesome/human?query#hash';

    ret = parth.set(stems);
    ret.should.not.be.eql(null);

    regex = parth.get(path, (o = { }));
    regex.path.should.be.eql(stems);
    o.url.should.be.eql(path.match(/\/\S+/)[0]);
    o.notFound.should.be.eql('');
  });

  use = 'urls spaces and object paths';
  it('should handle '+use, function(){
    stems = ':method(get|post) /hello/:there/:you';
    path = 'post /hello/awesome/human/?query=and#hash-here page.user';
    ret = parth.set(stems);
    regex = parth.get(path, (o = { }));

    ret.should.not.be.eql(null);
    regex.path.should.be.eql(stems);
    o.url.should.be.eql(path.match(/\/\S+/)[0]);
    o.notFound.should.be.eql(' page.user');

    path = path.replace(/^post/, 'put');
    (parth.get(path) === null).should.be.eql(true);
  });

  use = 'urls spaces and object paths';
  it('should handle '+use, function(){
    stems = ':method(get|post) /go';
    path = 'post /go/awesome/human/?query=and#hash-here page.user';
    ret = parth.set(stems);
    regex = parth.get(path, (o = { }));

    ret.should.not.be.eql(null);
    regex.path.should.be.eql(stems);
    o.url.should.be.eql(path.match(/\/\S+/)[0]);
    o.notFound.should.be.eql('/human page.user');

    path = path.replace(/^post/, 'put');
    (parth.get(path) === null).should.be.eql(true);
  });
};
