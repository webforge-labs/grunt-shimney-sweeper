module.exports = function(grunt) {
  'use strict';

  var configMancer = require("config-mancer"), _ = grunt.util._;
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
      function(configFile, done) {
        configMancer.get(configFile, function(err, config, data) {
          if (err) return done('Cannot read the config from: '+configFile+' '+err);

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

  var generateConfig = function(options, config) {
    return stringifyObject(
      config, 
      {
        indent: options.indent,
        singleQuotes: false
      }
    );
  };

  var generateConfigFile = function(options, config, cb) {
    var configString = generateConfig(options, config);

    if (options.template) {
      configMancer.get(options.template, function(err, config, data) {
        if (err) return cb('Cannot read config from template: '+options.template);

        cb(null, data.src.replace(data.str, configString));
      });
    } else {
      cb(null, sprintf(
        "/* global requirejs */\n"+
        "requirejs.config(%s);\n",
        configString
      ));
    }
  };

  grunt.registerMultiTask('shimney-sweeper-merge-config', 'Merges configs together.', function() {
    var done = this.async();

    var options = this.options({
      targetFile: grunt.option('target-file'),
      indent: '  ',
      modify: false
    });

    if (!options.targetFile) {
      grunt.fatal('You need to specify a targetFile in the multi task options or per --target-file');
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

      generateConfigFile(options, mergedConfig, function(err, fileContents) {
        if (err) return grunt.fatal(err);

        grunt.file.write(options.targetFile, fileContents);
        done();
      });

    });
  });
};
