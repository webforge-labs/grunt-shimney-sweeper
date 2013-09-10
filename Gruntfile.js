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
        'tasks/*.js',
        'tests/*.js',
        'test/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
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

    "shimney-sweeper-build": {
      'no-target': {
        options: {

        }
      },

      test: {
        options: {
          targetDir: 'tmp/',

          project: {
            src: 'tests/files/build-fixture-with-vendors/project/www/js/'
          },
          
          libaries: [
            {
              name: 'external-library',
              src: 'tests/files/build-fixture-with-vendors/external-library/src'
            }
          ]
        }
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
  grunt.loadNpmTasks('grunt-release');

  grunt.registerTask('test', ['clean', 'shimney-sweeper:update-config', 'nodeunit']);
  grunt.registerTask('default', ['jshint', 'test']);
};
