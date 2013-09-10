module.exports = function(grunt) {
  'use strict';

  var requirejs = require('requirejs');

  grunt.util.tasks = function(taskName, taskTarget, config) {
    grunt.config(taskName+'.'+taskTarget, config);
    grunt.task.run(taskName+':'+taskTarget);
  };

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

  var mergeBootFile = function() {


  };

  grunt.registerMultiTask('shimney-sweeper-build', 'Builds a full project with shimneys.', function() {
    var done = this.async();

    var options = this.options({
      prepareDir: 'tmp/',
      targetDir: grunt.option('target-dir')
    });

    if (!options.targetDir) {
      grunt.fatal('You need to specify a targetDirectory in the multi task options or per --target-dir');
    }

    console.log('still done');
    done();
  });
};
