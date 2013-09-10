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

    "shimney-sweeper-merge-config": {
      "no-target": {
        options: {

        }
      },

      "test": {
        options: {
          targetFile: 'tmp/boot.js',

          configFiles: [
            'tests/files/merge-config-fixture/external-library/config.js',
            'tests/files/merge-config-fixture/project/boot.js'
          ]
        }
      },

      "template": {
        options: {
          targetFile: 'tmp/boot.js',

          template: 'tests/files/merge-config-fixture/project/boot.js',

          configFiles: [
            'tests/files/merge-config-fixture/external-library/config.js',
            'tests/files/merge-config-fixture/project/boot.js'
          ]
        }
      },

      "modify": {
        options: {
          targetFile: 'tmp/boot.js',

          configFiles: [
            'tests/files/merge-config-fixture/external-library/config.js',
            'tests/files/merge-config-fixture/project/boot.js'
          ],

          modify: function(mergedConfig) {
            return { paths: {'user': 'overriden'} };
          }
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
