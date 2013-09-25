module.exports = function(grunt) {
  'use strict';

  var ConfigFile = require('requirejs-config-file').ConfigFile;
  var _ = grunt.util._;
  var async = require('async');
  var stringifyObject = require("stringify-object");
  var sprintf = require('sprintf').sprintf;

  grunt.util.tasks = function(taskName, taskTarget, config) {
    grunt.config(taskName+'.'+taskTarget, config);
    grunt.task.run(taskName+':'+taskTarget);
  };

  var mergeConfigs = function(options, cb) {
    var mergedConfig = {};

    async.eachSeries(
      options.configFiles,
      function(configFilePath, done) {
        var configFile =  new ConfigFile(configFilePath);

        configFile.read(function(err, config) {
          if (err) return done('Cannot read the config from: '+configFilePath+' '+err);

          mergedConfig = _.merge(mergedConfig, config);
          done();
        });
      }, 
      function(err) {
        if (err) return cb(err);

        cb(null, mergedConfig);
      }
    );
  };

  grunt.registerMultiTask('shimney-sweeper-merge-config', 'Merges configs together.', function() {
    var done = this.async();

    var options = this.options({
      targetFile: grunt.option('target-file'),
      indent: '  ',
      modify: false
    });

    if (!options.targetFile) {
      grunt.fatal('You need to specify a targetFile in the multi task options or per --target-file on command line');
    }

    if (!options.configFiles) {
      grunt.fatal('You need to specify at least two configFiles to merge');
    }


    mergeConfigs(options, function(err, mergedConfig) {
      if (err) return grunt.fatal(err);

      if (options.modify) {
        var returnedConfig = options.modify.call(null, mergedConfig);

        // always trust returned stuff, otherwise let modify
        if (returnedConfig !== undefined) {
          mergedConfig = returnedConfig;
        }
      }

      if (options.template) {
        grunt.file.copy(options.template, options.targetFile);
      } else {
        grunt.file.write(
          options.targetFile, 
          "/* global requirejs */\n"+
          "requirejs.config({});\n"
        );
      }

      var targetConfigFile = new ConfigFile(options.targetFile);

      targetConfigFile.read(function(err, fileContents) {
        if (err) return grunt.fatal('Cannot read config from template '+err);

        targetConfigFile.write(function (err) {
          if (err) return grunt.fatal(err);

          done(true);
        });
      });
    });
  });
};
