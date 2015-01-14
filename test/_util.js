'use strict';

var fs = require('fs');

module.exports = {
  testSuite : function(){
    var testSuite = fs.readdirSync(__dirname);

    var exclude = [
      '_main.js',
      '_util.js'
    ];

    var testFirst = [ ];

    var last = [
      'combined.js',
      'params.js'
    ];

    // use it also to omit _main & _util files
    exclude.concat(testFirst, last).forEach(function(file){
      testSuite.splice(testSuite.indexOf(file), 1);
    });

    return testFirst.concat(testSuite, last);
  },
  pack: require('../lib/util')
};
