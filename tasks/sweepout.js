module.exports = function (grunt) {

  grunt.registerMultiTask('sweepout', 'sweeps your shimney. use sweepout --dir=\"path/to/it\" to export all shimneys from npm to an external directory', function () {
    var done = this.async();

    var options = this.options({
      nodeModulesUrl: this.data.node_modules, // path to node_modules
      js: "js",
      less: "less",
      css: "css",
      img: "img",
      configFile: undefined,
      packageRoot: ".",
      dir: grunt.option('dir'),
      baseUrl: ""
    });

    var sweeper = require('../lib/shimney/sweeper')(grunt);

    sweeper.sweepout(options, function (err, config) {
      if (err) {
        grunt.log.error(err);
        done(false);
      } else {
        grunt.log.ok('Sweeped out '+config.packages.length+' package'+(config.packages.length !== 1 ? 's' : '')+' to '+options.dir+'.');
        done(true);
      }
    });
  });
};