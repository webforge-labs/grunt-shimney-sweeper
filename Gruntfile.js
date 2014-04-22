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
        'test/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      tests: ['tmp'],
    },

    "sweep-config": {
      test: {
        options: {
          configFile: "tmp/config.js",
          packageRoot: "test/files/package_fixture",
          nodeModulesUrl: ""
        }
      }
    },

    "sweepout": {
      test: {
        options: {
          packageRoot: "tmp",
          // dir with commandline --dir
          configFile: "build/js/shimney/config.js" // if not provided it will be created in dir/config.js
        }
      }
    },

    "merge-configs": {
      "no-target": {
        options: {

        }
      },

      "test": {
        options: {
          targetFile: 'tmp/boot.js',

          configFiles: [
            'test/files/merge-config-fixture/external-library/config.js',
            'test/files/merge-config-fixture/project/boot.js'
          ]
        }
      },

      "template": {
        options: {
          targetFile: 'tmp/boot.js',

          template: 'test/files/merge-config-fixture/project/boot.js',

          configFiles: [
            'test/files/merge-config-fixture/external-library/config.js',
            'test/files/merge-config-fixture/project/boot.js'
          ]
        }
      },

      "modify": {
        options: {
          targetFile: 'tmp/boot.js',

          configFiles: [
            'test/files/merge-config-fixture/external-library/config.js',
            'test/files/merge-config-fixture/project/boot.js'
          ],

          modify: function(mergedConfig) {
            return { paths: {'user': 'overriden'} };
          }
        }
      }
    },

    simplemocha: {
      options: {
        globals: ['should'],
        timeout: 3000,
        ignoreLeaks: true,
        ui: 'bdd',
        reporter: 'spec'
      },

      all: { src: ['test/**/*.js'] }
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
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-release');

  grunt.registerTask('test', ['simplemocha']);
  grunt.registerTask('default', ['jshint', 'test']);
};
