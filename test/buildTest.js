var grunt = require('grunt');
var rimraf = require('rimraf');
var _ = grunt.util._;
var path = require('path');
var exec = require('child_process').exec;
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
chai.use(require('./helpers/file'));

var tmpDir = "tmp/";
var tmpPath = function (relativePath) {
  return (tmpDir+relativePath).split(/\//).join(path.sep);
};

var GRUNT_TASK_ERROR = 3, GRUNT_FATAL_ERROR = 1, GRUNT_OK = 0;

var build = {
  readConfig: function(configPath, cb) {
    require("config-mancer").get(tmpPath(configPath), function(err, config, data) {
      if (err) {
        assert.fail('config mancer should be able to read config in boot from: '+configPath);
      } else {
        return cb(config);
      }
    });
  },

  runTask: function(done, taskTarget, cliOptions, cb) {
    var gruntTask, tmpOut = tmpPath('grunt-out'), cmd, info;
    taskTarget = taskTarget || 'test';
    cliOptions = cliOptions ? cliOptions+' ' : '';
    grunt.file.mkdir(tmpDir);

    gruntTask = exec(cmd = 'grunt shimney-sweeper-build:'+taskTarget+' '+cliOptions+'> '+tmpOut,
      function (err, stdout, stderr) {
        if (err !== null) {
          info = {
            cmd: cmd,
            out: grunt.file.read(tmpOut),
            err: err
          };
        } else {
          info = {
            cmd: cmd,
            out: grunt.file.read(tmpOut),
            err: null
          };
        }
      });

    gruntTask.on('close', function (code) {
      info.code = code;
      if (cb) {
        cb(info);
      } else if (info.code !== 0) {
        console.log('Error calling '+info.cmd, info.err);
        console.log(info.out);
      } else {
        //console.log('grunt exited with code 0');
      }
      
      done();
    });
  }
};

before(function(done) {
  rimraf(tmpDir, done);  
});

describe('build', function() {
  var baseUrl = 'src/';

  describe('task options', function() {

    it('should require a target-dir specified', function(done) {
      build.runTask(done, 'no-target', '--no-color', function(info) {
        expect(info.out).to.contain('You need to specify a targetDirectory');
        expect(info.code).to.be.equal(GRUNT_FATAL_ERROR); // whats the right for "usage error"?
      });
    });

    it('should accept a target-dir specified through cli options', function(done) {
      build.runTask(done, 'no-target', '--no-color --target-dir='+tmpDir, function(info) {
        expect(info.out).to.contain('Done, without errors');
        expect(info.code).to.be.equal(GRUNT_OK);
      });
    });

  });

  before(function(done) {
    build.runTask(done);
  });

  describe('merges the configuration files into the boot file', function() {

    it('should write the boot file into the baseUrl location path', function() {
      expect(tmpPath(baseUrl+'boot.js')).to.be.an.existingFile;
    });

    it("should write a config into the boot file", function(done) {
      build.readConfig(baseUrl+'boot.js', function(err, config) {
        expect(config).to.have.property('paths');
      });
    });

    describe("the config in the boot.js", function () {
      var config;
      beforeEach(function(done) {
        build.readConfig(baseUrl+'boot.js', function(err, readConfig) {
          config = readConfig;
        });
      });

      it('should include the paths from the external library', function() {
        expect(config.paths).to.have.property('img-files', '../img');  // better: pointing to real file
        expect(config.paths).to.have.property('tpl', '../templates');  // better: pointing to real file
      });

      it('should include the paths from the project in app', function() {
        expect(config.paths).to.have.property('flash', '../assets/flash');  // better: pointing to real file
      });

    });

  });

  describe.skip('copies all sources and assets to the baseUrl before it optimizes', function() {

    it('should copy sources from the external-library into baseUrl', function() {
      expect(tmpPath(baseUrl+'main.js')).to.be.an.existingFile;
      expect(tmpPath(baseUrl+'submodule.js')).to.be.an.existingFile;
    });

    it('should copy sources from the project into baseUrl', function() {
      expect(tmpPath(baseUrl+'app/project.js')).to.be.an.existingFile;
      expect(tmpPath(baseUrl+'app/submodule.js')).to.be.an.existingFile;
    });

    it('should copy the additional paths from the external library into root', function() {
      expect(tmpPath('templates/compiled.js')).to.be.an.existingFile;
      expect(tmpPath('img/external-library-logo.png')).to.be.an.existingFile;
    });


    it('should copy the additional paths from the project into root', function() {
      expect(tmpPath('assets/flash/fallback.swf')).to.be.an.existingFile;
    });

  });

  describe.skip('uses the requirejs optimizer to optimize the copied files', function() {

    it("should define the baseUrl as the src directory", function() {
    });

    it("should define the appDir as the directory", function() {
    });

    it("should combine the dir with uglify", function() {
    });

    it("should remove not needed files", function() {
    });
  });

});
