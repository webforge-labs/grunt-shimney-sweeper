module.exports = function (grunt) {


  grunt.registerTask('shimney-sweeper', 'sweeps your shimney. use grunt shimney-sweeper:todo  todos are: update-config, sweepout', function (todo) {
    var done = this.async();

    var options = this.options({
      configFile: "www/js/config.js",
      packageDir: ".",
      nodeModulesUrl: "../../"
    });

    var sweeper = require('../lib/shimney/sweeper')(grunt);

    if (todo === 'update-config') {
      sweeper.updateConfig(options, done);

    } else if (todo === 'sweepout') {
      options.dir = grunt.option('dir');
      sweeper.sweepout(options, done);

    } else {
      grunt.log.error(
        "the todo: "+todo+" is not defined.\n"+
        "Use grunt shimney-sweeper:update-config to update your requirejs configuration.\n"+
        "Use grunt shimney-sweeper:sweepout --dir=\"path/to/it\" to export all shimneys from npm to an external directory."
      );
      done(false);
    }
  });
};