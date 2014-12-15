'use strict';

var should = require('should');
var use, path, stems, ret, o;

module.exports = function(Parth){
  var parth = new Parth();

  use = 'urls and spaces';
  it('should handle '+use, function(){
    stems = ':method(get) /hello/:there';
    path = 'get /hello/awesome/human?query#hash';
    ret = parth.set(stems).get(path, (o = { }));

    ret.should.not.be.eql(null);
    o.path.should.be.eql(stems);
    o.input.should.be.eql(path);
    o.notFound.should.be.eql(true);
  });

  use = 'urls spaces and object paths';
  it('should handle '+use, function(){
    stems = ':method(get|post) /hello/:there/:you';
    path = 'post /hello/awesome/human/?query=and#hash-here page.user';
    ret = parth.set(stems).get(path, (o = { }));

    ret.should.not.be.eql(null);
    o.path.should.be.eql(stems);
    o.input.should.be.eql(path);
    o.notFound.should.be.eql(false);

    path = path.replace(/^post/, 'put');
    should(parth.get(path)).be.eql(null);
  });

  use = 'urls spaces and object paths';
  it('should handle '+use, function(){
    stems = ':method(get|post) /go';
    path = 'post /go/awesome/human/?query=and#hash-here page.user';
    ret = parth.set(stems).get(path, (o = { }));

    should(ret).not.be.eql(null);
    o.path.should.be.eql(stems);
    o.input.should.be.eql(path);
    o.notFound.should.be.eql(true);

    path = path.replace(/^post/, 'put');
    should(parth.get(path)).be.eql(null);
  });
};
