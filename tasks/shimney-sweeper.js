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
      sweeper.updateConfig(options, function (err, config) {
        if (err) {
          grunt.log.error('cannot save requirejs config'+ err);
          done(false);
        } else {
          done(true);
        }
      });

    } else if (todo === 'sweepout') {
      options.dir = grunt.option('dir');
      sweeper.sweepout(options, function(err, packages) {
        if (err) {
          grunt.log.error('cannot save requirejs config'+ err);
          done(false);
        } else {
          grunt.log.ok('Sweeped out '+packages.length+' package'+(packages.length !== 1 ? 's' : '')+' to '+options.dir+'.');
          done(true);
        }
      });

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