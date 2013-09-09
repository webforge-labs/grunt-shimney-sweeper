module.exports = function(grunt) {
  'use strict';

  var requirejs = require('requirejs');

  requirejs.define('node/print', [], function() {
    return function print(msg) {
      if (msg.substring(0, 5) === 'Error') {
        grunt.log.errorlns(msg.substr(5));
        grunt.fail.warn('RequireJS failed.');
      } else {
        grunt.log.oklns(msg);
      }
    };
  });

  var requirejsOptimize = function (options, done) {
    if (!options.done) {
      options.done = function(done, response){
        done();
      };
    }

    if (!options.logLevel) {
      options.logLevel = 0;
    }

    grunt.verbose.writeflags(options, 'RequireJS-Options');

    return requirejs.optimize(options, options.done.bind(null, done));
  };

  grunt.registerMultiTask('shimney-sweeper-build', 'Builds a full project with shimneys.', function() {
    var done = this.async();

    
  });
};
