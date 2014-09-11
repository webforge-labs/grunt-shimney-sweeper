module.exports = function(grunt) {
  'use strict';

  var ConfigFile = require('requirejs-config-file').ConfigFile;
  var _ = require('lodash');
  var async = require('async');
  var stringifyObject = require("stringify-object");
  var sprintf = require('sprintf').sprintf;

  var mergeConfig = function(configMine, configTheirs) {
    // paths and everything else is easy to merge, but not packages, they have the key name: which should be merging criteria (not the position in the array packages)

    configTheirs = _.clone(configTheirs);

    // reindex by name to allow correct merging
    if (configMine.packages) {
      configMine.packages = _.indexBy(configMine.packages, 'name');
    }
    if (configTheirs.packages) {
      configTheirs.packages = _.indexBy(configTheirs.packages, 'name');
    }

    _.merge(configMine, configTheirs);

    // convert back to numeric array
    configMine.packages = _.values(configMine.packages);

  };

  var mergeConfigs = function(options, cb) {
    var mergedConfig = {};

    async.eachSeries(
      options.configFiles,
      function(configFilePath, done) {
        var configFile =  new ConfigFile(configFilePath);

        configFile.read(function(err, config) {
          if (err) return done('Cannot read the config from: '+configFilePath+' '+err);

          mergeConfig(mergedConfig, config);
          done();
        });
      }, 
      function(err) {
        if (err) return cb(err);

        cb(null, mergedConfig);
      }
    );
  };

  grunt.registerMultiTask('merge-configs', 'Merge several requirejs configs together.', function() {
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

      targetConfigFile.read(function(err, config) {
        if (err) return grunt.fatal('Cannot read config from template '+err);

        mergeConfig(config, mergedConfig);

        targetConfigFile.write(function (err) {
          if (err) return grunt.fatal(err);

          done(true);
        });
      });
    });
  });
};
