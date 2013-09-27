module.exports = function (grunt) {

  grunt.registerMultiTask('sweepout', 'sweeps your shimney. use sweepout --dir=\"path/to/it\" to export all shimneys from npm to an external directory', function () {
    var done = this.async();

    var options = this.options({
      configFile: "www/js/config.js",
      packageRoot: ".",
      dir: grunt.option('dir')
    });

    var sweeper = require('../lib/shimney/sweeper')(grunt);

    sweeper.sweepout(options, done);
  });
};