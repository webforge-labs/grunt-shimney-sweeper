var grunt = require('grunt');
var rimraf = require('rimraf');
var _ = grunt.util._;
var path = require('path');
var exec = require('child_process').exec;
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
chai.use(require('./helpers/file'));

var tmp = "tmp/";

var tmpPath = function (relativePath) {
  return (tmp+relativePath).split(/\//).join(path.sep);
};

var build = {
  readConfig: function(configPath, cb) {
    require("config-mancer").get(tmpPath(configPath), function(err, config, data) {
      if (err) {
        assert.fail('config mancer should be able to read config in boot from: '+baseUrl+'boot.js');
      } else {
        return cb(config);
      }
    });
  }
};

before(function(done) {
  rimraf(tmp, done);
});

before(function(done) {
  var gruntTask;

  gruntTask = exec('grunt shimney-sweeper-build:test',
    function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });

  gruntTask.on('close', function (code) {
    console.log('grunt exited with code ' + code);
    done();
  });
});

describe('build', function() {
  var baseUrl = 'src/';

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
