var grunt = require('grunt');
var rimraf = require('rimraf');
var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
chai.use(require('./helpers/file'));

var tmpDir = "tmp/";
var tmpPath = function (relativePath) {
  return (tmpDir+relativePath).split(/\//).join(path.sep);
};

var GruntUtil = require('./helpers/grunt-utils');
var utils = new GruntUtil('merge-configs');
var GRUNT_EXIT = utils.GRUNT_EXIT;

before(function(done) {
  rimraf(tmpDir, done);
});

describe('task merge-configs', function() {
  var bootjs = tmpPath('boot.js'), config;

  it('should require a targetFile as a path specified', function(done) {
    utils.task('no-target').run(function(info) {
      expect(info.out).to.contain('You need to specify a targetFile');
      expect(info.code).to.be.equal(GRUNT_EXIT.FATAL_ERROR); // whats the right for "usage error"?
      done();
    });
  });

  it.skip('should accept a targetFile specified through cli options', function(done) {
    utils.task('test', '--target-file='+tmpDir).run(function(info) {
      utils.testOK(info);

      done();
    });
  });

  describe("when called correctly", function () {
    it('should write the targetFile', function(done) {
      utils.task('test', '--no-color').run(function(info) {
        utils.taskOK(info);
        expect(bootjs).to.be.an.existingFile;

        done();
      });
    });

    it('should write a readable targetFile', function(done) {
      utils.task('test').run(function(info) {
        utils.taskOK(info);
        expect(bootjs).to.be.an.existingFile;

        utils.readConfig(bootjs, function(err, readConfig) {
          expect(err).to.not.exist;
          expect(readConfig).to.exist;

          done();
        });
      });
    });

    describe('and when returning a merged config', function() {
      
      it('should merge every config property from both configs into the target-file', function(done) {
        utils.runAndRead('test', bootjs, function(err, config) {
          expect(err).to.not.exist;

          expect(config).to.have.property('paths');
          expect(config).to.have.property('packages');
          expect(config).to.have.property('baseUrl');
          expect(config).to.have.property('urlArgs');

          done();
        });
      });
    

      it.only('should merge the packages as a special config property from both configs into the target-file packages respecting the name attribute', function(done) {
        utils.runAndRead('test', bootjs, function(err, config) {
          expect(err).to.not.exist;

          expect(config).to.have.property('packages');

          var packages = {}, index = [];
          config.packages.forEach(function(pkg) {
            index.push(pkg.name);
            packages[pkg.name] = pkg;
          });

          
          chai.config.showDiff = true;

          // dont use simplemocha for seeing the diff
          expect(index, 'not all packages are merged correctly').to.be.eql([
            'knockout',
            'jquery',
            'sammy',
            'twitter-bootstrap',
            'lodash',
            'hogan',
            'cookie-monster',
            'JSON',
            'datepicker',
          ]);

          expect(packages).to.have.deep.property('knockout.name', 'knockout');
          expect(packages, 'location for knockout should be overridden by project config').to.have.deep.property('knockout.location', '../other-path/../node_modules/shimney-knockout');

          expect(packages).to.have.deep.property('datepicker.name', 'datepicker');
          expect(packages, 'jquery should not be overriden by project config by index').to.have.deep.property('jquery.name', 'jquery');
          

          done();
        });
      });
    });

    describe('and when called with template option', function () {

      it("should merge every config property from all configs and use the template for the written file", function(done) {
        utils.runAndRead('template', bootjs, function(err, readConfig) {
          if (err) return done(err);

          expect(readConfig).to.have.property('paths');
          expect(readConfig).to.have.property('packages');
          expect(readConfig).to.have.property('baseUrl');
          expect(readConfig).to.have.property('urlArgs');

          var fileContent = grunt.file.read(bootjs);

          expect(fileContent).to.include("define(['require', 'boot-helper'], function(require, boot) {");

          done();
        });
      });
    });

    describe("and when called with modify option", function () {

      it("should let the user modifiy the mergedConfig", function(done) {
        utils.runAndRead('modify', bootjs, function(err, readConfig) {
          if (err) return done(err);

          expect(readConfig).to.be.deep.equal({
            paths: {'user': 'overriden'}
          });

          done();
        });
      });
    });
  });
});
