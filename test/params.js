'use strict';

var stem, path, result;

module.exports = function(Parth){
  var parth = new Parth();

  it('can be given as part of the input string', function(){
    stem = 'post /:number(\\d+)';
    path = 'post /1/?query';
    result = parth.set(stem).get(path);
    result.should.have.properties({
      params: {
        number: '1',
        queryFragment: '?query'
      }
    });
  });

  it('may not have contain labels', function(){
    stem = '(get|post) /hello/:there/:you';
    path = 'post /hello/awesome/10/?query=string&value=true#hash';
    result = parth.set(stem).get(path);
    result.should.have.properties({
      params: {
        '0': 'post',
        you: '10',
        there: 'awesome',
        queryFragment: '?query=string&value=true#hash'
      }
    });
  });

  it('parameter labels should be at params', function(){
    stem = ':method(get|post) /page/:there/:you';
    path = 'post /page/awesome/10/?query#hash';
    result = parth.set(stem).get(path);
    result.should.have.properties({
      params: {
        you: '10',
        there: 'awesome',
        method: 'post',
        queryFragment: '?query#hash'
      }
    });
  });
};
