module.exports = function (grunt) {


  grunt.registerTask('shimney-sweeper', 'sweeps your shimney. use grunt shimney-sweeper:todo  todos are: update-config, sweepout', function (todo) {
    var done = this.async();

    var options = this.options({
      configFile: "www/js/config.js",
      packageDir: ".",
      nodeModulesUrl: "../../"
    });

    var sweeper = require('lib/shimney-sweeper')(grunt);

    if (todo === 'update-config') {
      sweeper.updateConfig(options, done);

    } else if (todo === 'sweepout') {
      sweeper.sweepout(options, done);

    } else {
      grunt.log.error("the todo: "+todo+" is not defined.\nUse grunt shimney-sweeper:update-config to update your requirejs configuration.\nUse grunt shimney-sweeper:sweepout to export all shimneys from npm to an external directory.");
      done(false);
    }
  });
};