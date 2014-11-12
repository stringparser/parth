'use strict';

var parth = require('../');
var testPath = [
  '/hello/thing',
  '/hey/world'
];
parth.set('/hello/world');
parth.set('/hello/:there');
parth.set('/:page/world');
parth('/hello/world');
parth('/whatever');

testPath.forEach(function(pathname){
  console.log('test', pathname, parth.get(pathname));
});
console.log('\n cache', parth.cache);
