'use strict';

var should = require('should');
var use, path, stems, o;

module.exports = function(Parth){
  var parth = new Parth();

  use = 'urls and spaces';
  it('should handle '+use, function(){
    stems = ':method(get) /hello/:there/:you';
    path = 'get /hello/awesome/human?query=here#hash';
    parth.set(stems);
    parth.get(path, (o = { }));
    should(o.url).be.eql(path.match(/\/\S+/)[0]);
    should(o.regex.path).be.eql(stems);
    should(o.params).be.eql({
      _ : ['get', 'awesome', 'human'],
      method: 'get',
      there: 'awesome',
      you: 'human'
    });

    path = path.replace(/^get/, 'delete');
    should(parth.get(path)).be.eql(null);
  });
  use = 'urls spaces and object paths';
  it('should handle '+use, function(){
    stems = ':method(get) /hello/:there/:you page.:data';
    path = 'get /hello/awesome/human page.user';
    parth.set(stems);
    parth.get(path, (o = { }));
    should(o.url).be.eql(path.match(/\/\S+/)[0]);
    should(o.regex.path).be.eql(stems);
    should(o.params).be.eql({
      _ : ['get', 'awesome', 'human', 'user'],
      method: 'get',
      there: 'awesome',
      you: 'human',
      data: 'user'
    });

    path = path.replace(/^get/, 'delete');
    should(parth.get(path)).be.eql(null);
  });
};
