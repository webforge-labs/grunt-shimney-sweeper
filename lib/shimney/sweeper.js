module.exports = function(grunt) {

  var Sweeper = function() {

    var that = this;

     /* @TODO refactor the reading from the config into the shimney lib and use as a dependency */

    this.createPackages = function(options, done, result) {
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

                dep.relativePath = dep.realPath.substr(rootDep.realPath.length+1);
                
                if (options.onTraverse) {
                  packages.push(options.onTraverse.call(this, dep, rootDep));
                } else {
                  packages.push({
                    name: dep.shimName,
                    location: options.nodeModulesUrl+dep.relativePath.replace(/\\/g, '/')
                  });
                }

                traverseDependencies(dep, rootDep);
              }
            });
          };

          traverseDependencies(rootPackage, rootPackage);

          result(packages);
        }
      });
    };

    this.updateConfig = function (options, done) {
      if (!grunt.file.exists(options.configFile)) {
        grunt.file.write(options.configFile, "/* globals requirejs */\nrequirejs.config({\n  \n});\n");
      }

      require("config-mancer").modify(options.configFile, function(err, config, save) {

        that.createPackages(options, done, function(packages) {
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

    this.sweepout = function (options, done) {
      var dir = options.dir;
      var path = require('path');

      options.onTraverse = function (dep) {
        grunt.file.mkdir([dir, 'npm', dep.shimName].join(path.sep)); // shimname is the moduleID so for example JSON

        return {
          name: dep.shimName,
          location: 'npm/'+dep.shimName
        };
      };

      that.createPackages(options, done, function (packages) {
        var config = {
          packages: packages
        };

        done(null, config);
      });

    };

  };

  return new Sweeper(grunt);

};
