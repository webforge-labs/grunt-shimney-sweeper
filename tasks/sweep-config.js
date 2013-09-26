module.exports = function (grunt) {

  grunt.registerTask('sweep-config', "Use grunt sweep-config to update your requirejs configuration to add all shimneys currently installed with npm.", function () {
    var done = this.async();

    var options = this.options({
      configFile: "www/js/config.js",
      packageRoot: ".",
      nodeModulesUrl: "../../"
    });

    var sweeper = require('../lib/shimney/sweeper')(grunt);

    sweeper.updateConfig(options, done);
  });
};