'use strict';

var path, stems, regex, o;

module.exports = function(Parth){
  var parth = new Parth();

  it('should be false for perfect match', function(){
    stems = ':method(get) /hello/:there';
    path = 'get /hello/awesome?query#hash';

    regex = parth.set(stems);
    regex.should.not.be.eql(null);
    parth.get(path, (o = { }));
    o.notFound.should.be.eql(false);
  });

  it('should have what is left of the path', function(){
    stems = ':method(get) /hello/:there';
    path = 'get /hello/awesome/human';

    regex = parth.set(stems);
    regex.should.not.be.eql(null);
    parth.get(path, (o = { }));
    o.notFound.should.be.eql('/human');
  });
};
