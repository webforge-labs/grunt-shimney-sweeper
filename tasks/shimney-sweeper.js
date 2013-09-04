module.exports = function (grunt) {

  /* @TODO refactor the reading from the config into the shimney lib and use as a dependency */

  var createPackages = function(packageDir, done, result) {
    var readInstalled = require("read-installed");
    var path = require('path');
    var _ = grunt.util._;

    readInstalled(packageDir, null, function (err, rootPackage) {
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
                location: "../../"+relativePath.replace(/\\/g, '/')
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

  var updateConfig = function (packageDir, configFile, done) {
    if (!grunt.file.exists(configFile)) {
      grunt.file.write(configFile, "/* globals requirejs */\nrequirejs.config({\n  \n});\n");
    }

    require("config-mancer").modify(configFile, function(err, config, save) {

      createPackages(packageDir, done, function(packages) {
        config.packages = packages;

        save(config, function(err) {
          if (err) {
            grunt.fatal('cannot save requirejs config'+ err);
            done(false);
          } else {
            grunt.log.ok('wrote '+packages.length+' package'+(packages.length !== 1 ? 's' : '')+' to '+configFile);
            done(true);
          }
        });
      });
    });
  };

  grunt.registerTask('shimney-sweeper', 'sweeps your shimney. usage: shimney-sweeper:update-config', function(todo) {
    var done = this.async();

    var options = this.options({
      config: "www/js/config.js",
      packageDir: "."
    });

    if (todo === 'update-config') {
      updateConfig(options.packageDir, options.config, done);

    } else {
      grunt.fatal('the todo: '+todo+' is not defined. Use grunt shimney-sweeper:update-config to update your requirejs configuration');
    }
  });


};