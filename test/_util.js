'use strict';

require('should');
var fs = require('fs');

module.exports = {
  testSuite : function(){
    var testSuite = fs.readdirSync(__dirname);

    var exclude = [
      '_main.js',
      '_util.js'
    ];

    var first = [
      'paths.js'
    ];

    var last = [
      'notFound.js'
    ];

    // use it also to omit _main & _util files
    exclude.concat(first, last).forEach(function(file){
      testSuite.splice(testSuite.indexOf(file), 1);
    });

    return first.concat(testSuite, last);
  },
  pack: require('../lib/util')
};
