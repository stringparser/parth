'use strict';

var stem, path, result;

module.exports = function(Parth){
  var parth = new Parth();

  it('can be given as part of the input string', function(){
    stem = 'post /:number(\\d+)';
    path = 'post /1';
    result = parth.set(stem).get(path);
    result.should.have.properties({
      params: {
        number: '1'
      }
    });
  });

  it('may not contain labels', function(){
    stem = '(get|post) /hello/:there/:you';
    path = 'post /hello/awesome/10';
    result = parth.set(stem).get(path);
    result.should.have.properties({
      params: {
        '0': 'post',
        you: '10',
        there: 'awesome'
      }
    });
  });

  it('querystring may contain parameters', function(){
    stem = ':method(get|post) /page/:there/:you/?\\?:query([^\\s]+)';
    path = 'post /page/awesome/10?query=here';
    result = parth.set(stem).get(path);
    result.should.have.properties({
      params: {
        you: '10',
        there: 'awesome',
        method: 'post',
        query: 'query=here'
      }
    });
  });
};
