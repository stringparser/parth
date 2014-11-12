'use strict';

var util = require('./util');
var type = require('utils-type');
var merge = require('utils-merge');

var cache = util.cache;

function parth(pattern_, opts_){
  var pattern = type(pattern_);
  var opts = type(opts_);

  var part = { };
  part.pattern = pattern = (pattern.array
    ? pattern.array.join(' ')
    : pattern.string || '').trim();

  util.getTokens(pattern, part);
  part.parsed = null;
  part.framed = pattern = pattern.replace(
    new RegExp(part.tokens, 'g'), ' ').trim();


  if( cache[part.pattern] ){
    return cache[part.pattern];
  }

  part.depth = part.framed.split(/[ ]/).length;
  pattern.replace(util.paramRE,
    function($0){
      var p = $0.split(/\:/).slice(1);
      util.sanitizeREParam(p);
      part.regexp = (part.regexp || part.framed.substring(0))
        .replace($0,(p[1] || '(\\S+)'));
      part.framed = part.framed.replace($0, ':'+p[0]);
    });

  // no params
  var regexp = part.regexp || '';
  part.parsed = regexp;
  part.regexp = new RegExp(
   (part.relative ? '' : '^' + part.sep).trim() +
        regexp.replace(/[ ]/g, part.sep) + part.sep + '?', 'g');

  part.parse = function parsePath(path){
    if(!path){ return this; }
    path = type(path);
    path = (path.string || '').trim()
      .replace(new RegExp(part.tokens+'$'), '');

    var copy;
    // add to patterns
    if(!cache[this.pattern]){
      copy = merge({ }, this);
      index = cache.patterns.length;
      delete copy.cache; delete copy.params;
      cache[this.pattern] = copy;
      while(index < this.depth){
        index = cache.patterns.push([]);
      }
      cache.patterns[index-1].push(this.pattern);
    }

    if( cache[path] ){
      return cache[path].params;
    }

    // prepare regexes
    if( !cache.regexps[this.depth-1] ){
      index = cache.regexps.length;
      while(index < this.depth){
        index = cache.regexps.push([ ]);
      }
    }
    var index = this.depth-1;
    regexp = this.regexp.source;
    if(cache.regexps[index].indexOf(regexp) < 0){
      cache.regexps[index].push(regexp);
    }

    var re = new RegExp(cache.regexps[this.depth-1].join('|'),'g');
    var match = (re).exec(path);
    console.log('re', re, 'match', match);



    index = 1;
    this.params = { };
    var self = this;
    var param = this.framed.match(util.paramRE) || [ ];
    path.replace(part.regexp, function(/* arguments */){
        var label = param[index-1] || '';
        if(!label){ index++; return; }
        self.params[label.substring(1)] = arguments[index];
        index++; self.params._ = '?';
      });

    if( !this.params._ ){
      this.params = null;
      index = param = self = null; // wipe
    } else { this.params._ = util.getArgs(this); }

    this.cache = this.cache || cache;

    return this;
  };

  part.params = { };
  part.cache = cache;
  if(opts.string || opts.array){
    part.parse(opts);
  }
  return part;
}

parth.cache = cache;

module.exports = parth;
