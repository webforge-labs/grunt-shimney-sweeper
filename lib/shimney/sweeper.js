module.exports = function(grunt) {

  var ConfigFile = require('requirejs-config-file').ConfigFile;

  var Sweeper = function() {

    var that = this, _ = grunt.util._;

     /* @TODO refactor the reading from the config into the shimney lib and use as a dependency */

    this.createPackages = function(options, cb) {
      var readInstalled = require("read-installed");
      var path = require('path');

      readInstalled(options.packageRoot, null, function (err, rootPackage) {
        if (err) return cb(err);

        grunt.log.debug('found '+_.values(rootPackage.dependencies).length+' installedPackages in: '+options.packageRoot);

        var packages = [];
          // we could keep track of conflicting versions, if we use a hash here

        var traverseDependencies = function(parentDep, rootDep) {
          _(parentDep.dependencies).forEach(function(dep) {
            // @TODO: FIXME: if dep is just a string (a version string), then package is not installed locally(!)
            // this should be a bug for read-installed, shouldn't it?

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

        cb(null, packages);
      });
    };

    /*
     * options:
     * .configFile path to the file (empty or existing)
     * .nodesModulesUrl the path to add to packages to refer to node_modules (relative to baseUrl)
     * .packageRoot the directory where the baseUrl is relative to and the node_modules is inside
     */
    this.updateConfig = function (options, cb) {
      var configFile = new ConfigFile(options.configFile);

      configFile.createIfNotExists();

      configFile.read(function (err, config) {
        if (err) return cb(err);

        that.createPackages(options, function(err, packages) {
          if (err) return cb(err);

          config.packages = packages;

          configFile.write(function(err) {
            if (err) return cb(err);

            cb(null, config);
          });
        });
      });
    };

    /**
     * options
     * .dir where to sweepout to
     * .packageRoot the directory where the baseUrl is relative to and the node_modules is inside
     */
    this.sweepout = function (options, cb) {
      var dir = options.dir;
      var path = require('path');
      var relativeUrl = options.baseUrl ? options.baseUrl : "";
      
      options.onTraverse = function (dep) {
        var packageDir = [dir, 'shimney', dep.shimName].join(path.sep);
        grunt.file.mkdir(packageDir); // shimname is the moduleID so for example JSON

        var fileList = {};

        fileList['/main.js'] = '/main.js';

        if (dep.config && dep.config.shimney && dep.config.shimney.assets) {
          _(dep.config.shimney.assets).forEach(function(files, type) {
            _.forEach(files, function(file) {
              fileList['/'+file] = '/'+file;
            });
          });
        }

        _(fileList).forEach(function(src, target) {
          grunt.file.copy(dep.realPath+src, packageDir+target);
        });

        return {
          name: dep.shimName,
          location: relativeUrl+'shimney/'+dep.shimName
        };
      };

      var configFile = new ConfigFile(options.configFile || dir+path.sep+'config.js');

      configFile.createIfNotExists();
      
      that.createPackages(options, function(err, packages) {
        if (err) return cb(err);

        configFile.read(function (err, config) {
          if (err) return cb(err);

          config.packages = packages;

          configFile.write(function(err) {
            if (err) return cb(err);

            cb(null, config);
          });
        });
      });
    };
  };

  return new Sweeper(grunt);

};