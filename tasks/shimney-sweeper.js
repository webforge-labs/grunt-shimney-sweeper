module.exports = function (grunt) {

  /* @TODO refactor the reading from the config into the shimney lib and use as a dependency */

  var createPackages = function(options, done, result) {
    var readInstalled = require("read-installed");
    var path = require('path');
    var _ = grunt.util._;

    readInstalled(options.packageDir, null, function (err, rootPackage) {
      if (err) {
        grunt.fatal(err);
      } else {

        var packages = [];
        // we could keep track of conflicting versions, if we use a hash here

        var traverseDependencies = function(parentDep, rootDep) {
          _(parentDep.dependencies).forEach(function(dep) {
            if (dep.name.indexOf('shimney-') === 0) {
              // something like node_modules/path/to/dep (without a front (bask)slash)

              if (dep.config && dep.config.shimney && dep.config.shimney.moduleID) {
                dep.shimName = dep.config.shimney.moduleID;
              } else {
                dep.shimName = dep.name.substr("shimney-".length);
              }

              var relativePath = dep.realPath.substr(rootDep.realPath.length+1);
              
              packages.push({
                name: dep.shimName,
                location: options.nodeModulesUrl+relativePath.replace(/\\/g, '/')
              });

              traverseDependencies(dep, rootDep);
            }
          });
        };

        traverseDependencies(rootPackage, rootPackage);

        result(packages);
      }
    });
  };

  var updateConfig = function (options, done) {
    if (!grunt.file.exists(options.configFile)) {
      grunt.file.write(options.configFile, "/* globals requirejs */\nrequirejs.config({\n  \n});\n");
    }

    require("config-mancer").modify(options.configFile, function(err, config, save) {

      createPackages(options, done, function(packages) {
        config.packages = packages;

        save(config, function(err) {
          if (err) {
            grunt.fatal('cannot save requirejs config'+ err);
            done(false);
          } else {
            grunt.log.ok('wrote '+packages.length+' package'+(packages.length !== 1 ? 's' : '')+' to '+options.configFile);
            done(true);
          }
        });
      });
    });
  };

  grunt.registerTask('shimney-sweeper', 'sweeps your shimney. usage: shimney-sweeper:update-config', function(todo) {
    var done = this.async();

    var options = this.options({
      configFile: "www/js/config.js",
      packageDir: ".",
      nodeModulesUrl: "../../"
    });

    if (todo === 'update-config') {
      updateConfig(options, done);

    } else {
      grunt.log.error('the todo: '+todo+' is not defined. Use grunt shimney-sweeper:update-config to update your requirejs configuration');
      done(false);
    }
  });
};