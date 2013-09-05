/*
 * grunt-shimney-sweeper
 * https://github.com/webforge-labs/grunt-shimney-sweeper
 *
 * Licensed under the MIT license.
 */
module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    clean: {
      tests: ['tmp'],
    },

    "shimney-sweeper": {
      options: {
        configFile: "tmp/config.js",
        packageDir: "tests/files/package_fixture",
        nodeModulesUrl: ""
      }
    },

    nodeunit: {
      tests: ['tests/*_test.js'],
    },

    release: {
       options: {
         bump: true,
         add: true, 
         commit: true,
         tag: true, 
         push: true, 
         pushTags: true, 
         npm: true, 
         commitMessage: 'release <%= version %>',
         tagMessage: 'Version <%= version %>'
       }
     }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['clean', 'shimney-sweeper:update-config', 'nodeunit']);
  grunt.registerTask('default', ['jshint', 'test']);
};
